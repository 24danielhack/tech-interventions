import {
  IsString,
  IsOptional,
  IsEnum,
  IsUUID,
  IsArray,
  IsDateString,
} from 'class-validator';
import {
  IncidentCategory,
  PriorityLevel,
  InterventionStatus,
} from '@/database/entities';

export class CreateInterventionDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsEnum(IncidentCategory)
  category: IncidentCategory;

  @IsEnum(PriorityLevel)
  priority: PriorityLevel;

  @IsDateString()
  reportedDate: string;

  @IsString()
  reportedTime: string;

  @IsString()
  reportedBy: string;

  @IsUUID()
  departmentId: string;

  @IsOptional()
  @IsArray()
  attachments?: string[];
}

export class UpdateInterventionDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsEnum(IncidentCategory)
  category?: IncidentCategory;

  @IsOptional()
  @IsEnum(PriorityLevel)
  priority?: PriorityLevel;

  @IsOptional()
  @IsEnum(InterventionStatus)
  status?: InterventionStatus;

  @IsOptional()
  @IsUUID()
  technicianId?: string;

  @IsOptional()
  @IsString()
  diagnosis?: string;

  @IsOptional()
  @IsString()
  solution?: string;

  @IsOptional()
  @IsString()
  internalComments?: string;

  @IsOptional()
  @IsDateString()
  resolvedDate?: string;

  @IsOptional()
  @IsString()
  resolvedTime?: string;
}

export class ResolveInterventionDto {
  @IsString()
  solution: string;

  @IsOptional()
  @IsString()
  diagnosis?: string;

  @IsDateString()
  resolvedDate: string;

  @IsString()
  resolvedTime: string;
}

export class FilterInterventionsDto {
  @IsOptional()
  @IsEnum(InterventionStatus)
  status?: InterventionStatus;

  @IsOptional()
  @IsEnum(IncidentCategory)
  category?: IncidentCategory;

  @IsOptional()
  @IsEnum(PriorityLevel)
  priority?: PriorityLevel;

  @IsOptional()
  @IsUUID()
  technicianId?: string;

  @IsOptional()
  @IsUUID()
  departmentId?: string;

  @IsOptional()
  skip?: number;

  @IsOptional()
  take?: number;
}
