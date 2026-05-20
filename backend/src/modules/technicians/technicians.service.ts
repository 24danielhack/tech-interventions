import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { User, Intervention } from '@/database/entities';
import { CreateTechnicianDto, UpdateTechnicianDto } from './technicians.dto';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class TechniciansService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Intervention)
    private interventionRepository: Repository<Intervention>,
  ) {}

  async findAll() {
    return this.usersRepository.find({
      order: { createdAt: 'DESC' },
    });
  }

  async findById(id: string): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: { id },
      relations: ['interventions'],
    });

    if (!user) {
      throw new NotFoundException(`Technician ${id} not found`);
    }

    return user;
  }

  async create(createDto: CreateTechnicianDto): Promise<User> {
    const tempPassword = Math.random().toString(36).slice(-8);
    const hashedPassword = await bcrypt.hash(tempPassword, 10);

    const user = this.usersRepository.create({
      ...createDto,
      password: hashedPassword,
    });

    return this.usersRepository.save(user);
  }

  async update(id: string, updateDto: UpdateTechnicianDto): Promise<User> {
    const user = await this.findById(id);

    Object.assign(user, updateDto);

    return this.usersRepository.save(user);
  }

  async getTechnicianStats(
    id: string,
    startDate?: Date,
    endDate?: Date,
  ) {
    const user = await this.findById(id);

    const where = {
      technicianId: id,
      ...(startDate && endDate
        ? { createdAt: Between(startDate, endDate) }
        : {}),
    };

    const interventions = await this.interventionRepository.find({
      where,
    });

    const resolved = interventions.filter((i) => i.status === 'resolved').length;
    const pending = interventions.filter((i) => i.status === 'pending').length;
    const inProgress = interventions.filter((i) => i.status === 'in_progress')
      .length;

    const avgResolutionTime = this.calculateAvgResolutionTime(interventions);

    return {
      technician: {
        id: user.id,
        name: user.fullName,
        email: user.email,
        role: user.role,
      },
      stats: {
        totalInterventions: interventions.length,
        resolved,
        pending,
        inProgress,
        avgResolutionTime,
      },
      interventions: interventions.map((i) => ({
        ticketNumber: i.ticketNumber,
        title: i.title,
        status: i.status,
        priority: i.priority,
        duration: i.resolutionDuration,
      })),
    };
  }

  private calculateAvgResolutionTime(interventions: Intervention[]): string {
    const resolved = interventions.filter((i) => i.durationInMinutes !== null);
    if (resolved.length === 0) return 'N/A';

    const totalMinutes = resolved.reduce((sum, i) => sum + (i.durationInMinutes || 0), 0);
    const avgMinutes = Math.floor(totalMinutes / resolved.length);
    const hours = Math.floor(avgMinutes / 60);
    const minutes = avgMinutes % 60;

    return `${hours}h ${minutes}m`;
  }
}
