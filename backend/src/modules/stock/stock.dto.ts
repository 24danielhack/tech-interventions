import {
  IsString,
  IsOptional,
  IsEnum,
  IsNumber,
  IsInt,
  Min,
} from 'class-validator';
import { EquipmentCategory, EquipmentCondition } from '@/database/entities';

export class CreateInventoryItemDto {
  @IsString()
  name: string;

  @IsEnum(EquipmentCategory)
  category: EquipmentCategory;

  @IsOptional()
  @IsString()
  serialNumber?: string;

  @IsInt()
  @Min(0)
  quantityAvailable: number;

  @IsInt()
  @Min(0)
  quantityTotal: number;

  @IsEnum(EquipmentCondition)
  condition: EquipmentCondition;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsString()
  supplier?: string;

  @IsOptional()
  @IsNumber()
  unitCost?: number;

  @IsOptional()
  @IsInt()
  lowStockThreshold?: number;

  @IsOptional()
  @IsString()
  description?: string;
}

export class UpdateInventoryItemDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsEnum(EquipmentCategory)
  category?: EquipmentCategory;

  @IsOptional()
  @IsInt()
  @Min(0)
  quantityAvailable?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  quantityTotal?: number;

  @IsOptional()
  @IsEnum(EquipmentCondition)
  condition?: EquipmentCondition;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsString()
  supplier?: string;

  @IsOptional()
  @IsNumber()
  unitCost?: number;

  @IsOptional()
  @IsInt()
  lowStockThreshold?: number;

  @IsOptional()
  @IsString()
  description?: string;
}

export class UseInventoryItemDto {
  @IsInt()
  @Min(1)
  quantity: number;

  @IsOptional()
  @IsString()
  reason?: string;

  @IsOptional()
  @IsString()
  interventionId?: string;

  @IsString()
  technicianId: string;
}

export class RestockInventoryDto {
  @IsInt()
  @Min(1)
  quantity: number;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsString()
  supplier: string;
}
