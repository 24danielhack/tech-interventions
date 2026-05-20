import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { InventoryItem } from './inventory-item.entity';
import { User } from './user.entity';
import { Intervention } from './intervention.entity';

@Entity('inventory_usages')
export class InventoryUsage {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => InventoryItem, (item) => item.usages)
  @JoinColumn({ name: 'inventoryItemId' })
  inventoryItem: InventoryItem;

  @Column('uuid')
  inventoryItemId: string;

  @Column({ type: 'int' })
  quantity: number;

  @ManyToOne(() => Intervention, (intervention) => intervention.inventoryUsages)
  @JoinColumn({ name: 'interventionId' })
  intervention: Intervention;

  @Column('uuid', { nullable: true })
  interventionId: string;

  @ManyToOne(() => User, (user) => user.inventoryUsages)
  @JoinColumn({ name: 'technicianId' })
  technician: User;

  @Column('uuid')
  technicianId: string;

  @Column({ nullable: true })
  reason: string;

  @Column({ nullable: true })
  notes: string;

  @CreateDateColumn()
  usedAt: Date;
}
