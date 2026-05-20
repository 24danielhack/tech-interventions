import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  UseGuards,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { StockService } from './stock.service';
import {
  CreateInventoryItemDto,
  UpdateInventoryItemDto,
  UseInventoryItemDto,
  RestockInventoryDto,
} from './stock.dto';
import { JwtAuthGuard } from '@/guards/jwt-auth.guard';
import { RolesGuard } from '@/guards/roles.guard';
import { Roles } from '@/decorators/roles.decorator';
import { UserRole } from '@/database/entities';

@ApiTags('Inventory / Stock Management')
@Controller('inventory')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class StockController {
  constructor(private stockService: StockService) {}

  @Post('items')
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  async createItem(@Body() createDto: CreateInventoryItemDto) {
    return this.stockService.createItem(createDto);
  }

  @Get('items')
  @Roles(UserRole.ADMIN, UserRole.MANAGER, UserRole.TECHNICIAN, UserRole.OBSERVER)
  async findAll(
    @Query('category') category?: string,
    @Query('search') search?: string,
    @Query('onlyLowStock') onlyLowStock?: boolean,
  ) {
    return this.stockService.findAll(category, search, onlyLowStock);
  }

  @Get('items/:id')
  @Roles(UserRole.ADMIN, UserRole.MANAGER, UserRole.TECHNICIAN, UserRole.OBSERVER)
  async findById(@Param('id') id: string) {
    return this.stockService.findById(id);
  }

  @Put('items/:id')
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  async update(@Param('id') id: string, @Body() updateDto: UpdateInventoryItemDto) {
    return this.stockService.update(id, updateDto);
  }

  @Post('items/:id/use')
  @Roles(UserRole.ADMIN, UserRole.MANAGER, UserRole.TECHNICIAN)
  async useItem(@Param('id') id: string, @Body() useDto: UseInventoryItemDto) {
    return this.stockService.useItem(id, useDto);
  }

  @Post('items/:id/restock')
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  async restock(@Param('id') id: string, @Body() restockDto: RestockInventoryDto) {
    return this.stockService.restock(id, restockDto);
  }

  @Get('stats/overview')
  @Roles(UserRole.ADMIN, UserRole.MANAGER, UserRole.OBSERVER)
  async getStats() {
    return this.stockService.getInventoryStats();
  }

  @Get('history')
  @Roles(UserRole.ADMIN, UserRole.MANAGER, UserRole.OBSERVER)
  async getHistory(
    @Query('itemId') itemId?: string,
    @Query('technicianId') technicianId?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.stockService.getUsageHistory(
      itemId,
      technicianId,
      startDate ? new Date(startDate) : undefined,
      endDate ? new Date(endDate) : undefined,
    );
  }
}
