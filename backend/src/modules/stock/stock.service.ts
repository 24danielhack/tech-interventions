import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOptionsWhere, Like } from 'typeorm';
import {
  InventoryItem,
  InventoryUsage,
  Alert,
  AlertType,
  AlertSeverity,
} from '@/database/entities';
import {
  CreateInventoryItemDto,
  UpdateInventoryItemDto,
  UseInventoryItemDto,
  RestockInventoryDto,
} from './stock.dto';

@Injectable()
export class StockService {
  constructor(
    @InjectRepository(InventoryItem)
    private inventoryRepository: Repository<InventoryItem>,
    @InjectRepository(InventoryUsage)
    private usageRepository: Repository<InventoryUsage>,
    @InjectRepository(Alert)
    private alertRepository: Repository<Alert>,
  ) {}

  async createItem(createDto: CreateInventoryItemDto): Promise<InventoryItem> {
    const item = this.inventoryRepository.create({
      ...createDto,
      lowStockThreshold: createDto.lowStockThreshold || 5,
    });

    return this.inventoryRepository.save(item);
  }

  async findAll(category?: string, search?: string, onlyLowStock?: boolean) {
    const where: FindOptionsWhere<InventoryItem> = {
      isActive: true,
    };

    if (category) {
      where.category = category as any;
    }

    if (search) {
      where.name = Like(`%${search}%`);
    }

    let items = await this.inventoryRepository.find({ where });

    if (onlyLowStock) {
      items = items.filter((item) => item.isLowStock);
    }

    return items;
  }

  async findById(id: string): Promise<InventoryItem> {
    const item = await this.inventoryRepository.findOne({
      where: { id },
      relations: ['usages'],
    });

    if (!item) {
      throw new NotFoundException(`Inventory item ${id} not found`);
    }

    return item;
  }

  async update(id: string, updateDto: UpdateInventoryItemDto): Promise<InventoryItem> {
    const item = await this.findById(id);

    Object.assign(item, updateDto);

    return this.inventoryRepository.save(item);
  }

  async useItem(id: string, useDto: UseInventoryItemDto): Promise<InventoryUsage> {
    const item = await this.findById(id);

    if (item.quantityAvailable < useDto.quantity) {
      throw new BadRequestException(
        `Insufficient stock. Available: ${item.quantityAvailable}, Required: ${useDto.quantity}`,
      );
    }

    // Deduct from stock
    item.quantityAvailable -= useDto.quantity;
    await this.inventoryRepository.save(item);

    // Record usage
    const usage = this.usageRepository.create({
      inventoryItemId: id,
      quantity: useDto.quantity,
      technicianId: useDto.technicianId,
      interventionId: useDto.interventionId,
      reason: useDto.reason,
      usedAt: new Date(),
    });

    await this.usageRepository.save(usage);

    // Check for low stock alert
    if (item.isLowStock) {
      await this.createLowStockAlert(item);
    }

    return usage;
  }

  async restock(id: string, restockDto: RestockInventoryDto): Promise<InventoryItem> {
    const item = await this.findById(id);

    item.quantityAvailable += restockDto.quantity;
    item.quantityTotal += restockDto.quantity;

    const savedItem = await this.inventoryRepository.save(item);

    // Log the restock action
    await this.usageRepository.create({
      inventoryItemId: id,
      quantity: -restockDto.quantity, // Negative to indicate addition
      reason: `Restock from ${restockDto.supplier}`,
    });

    // Resolve any low stock alerts
    if (!item.isLowStock) {
      await this.resolveLowStockAlert(id);
    }

    return savedItem;
  }

  async getInventoryStats() {
    const items = await this.inventoryRepository.find();

    const totalItems = items.length;
    const lowStockItems = items.filter((item) => item.isLowStock).length;
    const defectiveItems = items.filter(
      (item) => item.condition === 'defective',
    ).length;
    const totalValue = items.reduce((sum, item) => sum + item.totalValue, 0);

    const itemsByCategory = items.reduce(
      (acc, item) => {
        acc[item.category] = (acc[item.category] || 0) + item.quantityAvailable;
        return acc;
      },
      {} as Record<string, number>,
    );

    return {
      totalItems,
      lowStockItems,
      defectiveItems,
      totalValue,
      itemsByCategory,
    };
  }

  async getUsageHistory(
    itemId?: string,
    technicianId?: string,
    startDate?: Date,
    endDate?: Date,
  ) {
    const query = this.usageRepository.createQueryBuilder('usage');

    if (itemId) {
      query.andWhere('usage.inventoryItemId = :itemId', { itemId });
    }

    if (technicianId) {
      query.andWhere('usage.technicianId = :technicianId', { technicianId });
    }

    if (startDate) {
      query.andWhere('usage.usedAt >= :startDate', { startDate });
    }

    if (endDate) {
      query.andWhere('usage.usedAt <= :endDate', { endDate });
    }

    return query
      .leftJoinAndSelect('usage.inventoryItem', 'item')
      .orderBy('usage.usedAt', 'DESC')
      .getMany();
  }

  private async createLowStockAlert(item: InventoryItem): Promise<void> {
    const existingAlert = await this.alertRepository.findOne({
      where: {
        type: AlertType.LOW_STOCK,
        relatedEntityId: item.id,
        isResolved: false,
      },
    });

    if (!existingAlert) {
      const alert = this.alertRepository.create({
        type: AlertType.LOW_STOCK,
        severity: AlertSeverity.WARNING,
        title: `Low Stock Alert: ${item.name}`,
        message: `${item.name} stock is low (${item.quantityAvailable}/${item.lowStockThreshold})`,
        relatedEntityId: item.id,
        relatedEntityType: 'InventoryItem',
      });

      await this.alertRepository.save(alert);
    }
  }

  private async resolveLowStockAlert(itemId: string): Promise<void> {
    await this.alertRepository.update(
      {
        type: AlertType.LOW_STOCK,
        relatedEntityId: itemId,
        isResolved: false,
      },
      {
        isResolved: true,
        resolvedAt: new Date(),
      },
    );
  }
}
