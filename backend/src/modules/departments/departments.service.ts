import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Department, Intervention } from '@/database/entities';
import { CreateDepartmentDto, UpdateDepartmentDto } from './departments.dto';

@Injectable()
export class DepartmentsService {
  constructor(
    @InjectRepository(Department)
    private departmentsRepository: Repository<Department>,
    @InjectRepository(Intervention)
    private interventionRepository: Repository<Intervention>,
  ) {}

  async findAll() {
    return this.departmentsRepository.find({
      order: { name: 'ASC' },
    });
  }

  async findById(id: string): Promise<Department> {
    const department = await this.departmentsRepository.findOne({
      where: { id },
    });

    if (!department) {
      throw new NotFoundException(`Department ${id} not found`);
    }

    return department;
  }

  async create(createDto: CreateDepartmentDto): Promise<Department> {
    const department = this.departmentsRepository.create(createDto);
    return this.departmentsRepository.save(department);
  }

  async update(id: string, updateDto: UpdateDepartmentDto): Promise<Department> {
    const department = await this.findById(id);

    Object.assign(department, updateDto);

    return this.departmentsRepository.save(department);
  }

  async getDepartmentStats(id: string) {
    const department = await this.findById(id);

    const interventions = await this.interventionRepository.find({
      where: { departmentId: id },
    });

    const resolved = interventions.filter((i) => i.status === 'resolved').length;
    const pending = interventions.filter((i) => i.status === 'pending').length;
    const inProgress = interventions.filter((i) => i.status === 'in_progress')
      .length;

    return {
      department,
      stats: {
        totalInterventions: interventions.length,
        resolved,
        pending,
        inProgress,
      },
    };
  }
}
