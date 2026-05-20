import { IsEnum, IsOptional } from 'class-validator';
import { ReportType } from '@/database/entities';

export class GenerateReportDto {
  @IsEnum(ReportType)
  type: ReportType;

  @IsOptional()
  startDate?: string;

  @IsOptional()
  endDate?: string;
}
