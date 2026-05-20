import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { InventoryUsage } from './inventory-usage.entity';

export enum EquipmentCategory {
  NETWORK = 'network',
  COMPUTER = 'computer',
  PERIPHERAL = 'peripheral',
  PRINTER = 'printer',
  CONSUMABLE = 'consumable',
  CABLE = 'cable',
  OTHER = 'other',
}

export enum EquipmentCondition {
  NEW = 'new',
  GOOD = 'good',
  FAIR = 'fair',
  DEFECTIVE = 'defective',
  OBSOLETE = 'obsolete',
}

@Entity('inventory_items')
export class InventoryItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({
    type: 'enum',
    enum: EquipmentCategory,
  })
  category: EquipmentCategory;

  @Column({ nullable: true })
  serialNumber: string;

  @Column({ type: 'int', default: 0 })
  quantityAvailable: number;

  @Column({ type: 'int', default: 0 })
  quantityTotal: number;

  @Column({
    type: 'enum',
    enum: EquipmentCondition,
    default: EquipmentCondition.GOOD,
  })
  condition: EquipmentCondition;

  @Column({ nullable: true })
  location: string;

  @Column({ nullable: true })
  supplier: string;

  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  unitCost: number;

  @Column({ type: 'int', default: 5 })
  lowStockThreshold: number;

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: true })
  image: string;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  addedDate: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => InventoryUsage, (usage) => usage.inventoryItem)
  usages: InventoryUsage[];

  // Calculated fields
  get isLowStock(): boolean {
    return this.quantityAvailable <= this.lowStockThreshold;
  }

  get totalValue(): number {
    return this.quantityAvailable * (this.unitCost || 0);
  }
}
