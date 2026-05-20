import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOptionsWhere } from 'typeorm';
import { Intervention, InterventionStatus } from '@/database/entities';
import {
  CreateInterventionDto,
  UpdateInterventionDto,
  ResolveInterventionDto,
  FilterInterventionsDto,
} from './interventions.dto';
import { v4 as uuid } from 'uuid';

@Injectable()
export class InterventionsService {
  constructor(
    @InjectRepository(Intervention)
    private interventionsRepository: Repository<Intervention>,
  ) {}

  async create(createDto: CreateInterventionDto): Promise<Intervention> {
    const ticketNumber = await this.generateTicketNumber();

    const intervention = this.interventionsRepository.create({
      ...createDto,
      ticketNumber,
      reportedDate: new Date(createDto.reportedDate),
      status: InterventionStatus.PENDING,
      attachments: createDto.attachments ? JSON.stringify(createDto.attachments) : undefined,
    } as any);

    return (await this.interventionsRepository.save(intervention)) as unknown as Intervention;
  }

  async findAll(filters?: FilterInterventionsDto) {
    const where: FindOptionsWhere<Intervention> = {};

    if (filters?.status) where.status = filters.status;
    if (filters?.category) where.category = filters.category;
    if (filters?.priority) where.priority = filters.priority;
    if (filters?.technicianId) where.technicianId = filters.technicianId;
    if (filters?.departmentId) where.departmentId = filters.departmentId;

    const skip = filters?.skip || 0;
    const take = filters?.take || 20;

    const [data, total] = await this.interventionsRepository.findAndCount({
      where,
      relations: ['technician', 'department'],
      skip,
      take,
      order: { createdAt: 'DESC' },
    });

    return {
      data,
      total,
      skip,
      take,
    };
  }

  async findById(id: string): Promise<Intervention> {
    const intervention = await this.interventionsRepository.findOne({
      where: { id },
      relations: ['technician', 'department', 'inventoryUsages'],
    });

    if (!intervention) {
      throw new NotFoundException(`Intervention ${id} not found`);
    }

    return intervention;
  }

  async update(id: string, updateDto: UpdateInterventionDto): Promise<Intervention> {
    const intervention = await this.findById(id);

    Object.assign(intervention, updateDto);

    return this.interventionsRepository.save(intervention);
  }

  async resolve(
    id: string,
    resolveDto: ResolveInterventionDto,
  ): Promise<Intervention> {
    const intervention = await this.findById(id);

    intervention.status = InterventionStatus.RESOLVED;
    intervention.solution = resolveDto.solution;
    intervention.diagnosis = resolveDto.diagnosis;
    intervention.resolvedDate = new Date(resolveDto.resolvedDate);
    intervention.resolvedTime = resolveDto.resolvedTime;

    // Calculate duration
    const duration = Math.floor(
      (intervention.resolvedDate.getTime() - intervention.reportedDate.getTime()) /
        (1000 * 60),
    );
    const hours = Math.floor(duration / 60);
    const minutes = duration % 60;
    intervention.resolutionDuration = `${hours}h ${minutes}m`;

    return this.interventionsRepository.save(intervention);
  }

  async assign(id: string, technicianId: string): Promise<Intervention> {
    const intervention = await this.findById(id);

    intervention.technicianId = technicianId;
    intervention.status = InterventionStatus.IN_PROGRESS;
    intervention.assignedDate = new Date();
    intervention.assignedTime = new Date().toLocaleTimeString();

    return this.interventionsRepository.save(intervention);
  }

  async escalate(id: string, reason: string): Promise<Intervention> {
    const intervention = await this.findById(id);

    intervention.status = InterventionStatus.ESCALATED;
    intervention.internalComments = `ESCALATED: ${reason}`;

    return this.interventionsRepository.save(intervention);
  }

  async getStats(startDate?: Date, endDate?: Date) {
    const query = this.interventionsRepository.createQueryBuilder('intervention');

    if (startDate) {
      query.andWhere('intervention.reportedDate >= :startDate', { startDate });
    }
    if (endDate) {
      query.andWhere('intervention.reportedDate <= :endDate', { endDate });
    }

    const total = await query.getCount();
    const resolved = await query
      .andWhere('intervention.status = :status', {
        status: InterventionStatus.RESOLVED,
      })
      .getCount();
    const pending = await query
      .andWhere('intervention.status = :status', {
        status: InterventionStatus.PENDING,
      })
      .getCount();
    const inProgress = await query
      .andWhere('intervention.status = :status', {
        status: InterventionStatus.IN_PROGRESS,
      })
      .getCount();

    return {
      total,
      resolved,
      pending,
      inProgress,
    };
  }

  private async generateTicketNumber(): Promise<string> {
    const count = await this.interventionsRepository.count();
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const sequence = String(count + 1).padStart(5, '0');

    return `TKT-${year}${month}${day}-${sequence}`;
  }
}
