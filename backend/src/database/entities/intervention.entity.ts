import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Department } from './department.entity';
import { InventoryUsage } from './inventory-usage.entity';

export enum InterventionStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in_progress',
  RESOLVED = 'resolved',
  ESCALATED = 'escalated',
  CANCELLED = 'cancelled',
}

export enum IncidentCategory {
  HARDWARE = 'hardware',
  NETWORK = 'network',
  SOFTWARE = 'software',
  HELPDESK = 'helpdesk',
  MAINTENANCE = 'maintenance',
  OTHER = 'other',
}

export enum PriorityLevel {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical',
}

@Entity('interventions')
export class Intervention {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  ticketNumber: string;

  @Column()
  title: string;

  @Column('text')
  description: string;

  @Column({
    type: 'enum',
    enum: IncidentCategory,
  })
  category: IncidentCategory;

  @Column({
    type: 'enum',
    enum: PriorityLevel,
    default: PriorityLevel.MEDIUM,
  })
  priority: PriorityLevel;

  @Column({
    type: 'enum',
    enum: InterventionStatus,
    default: InterventionStatus.PENDING,
  })
  status: InterventionStatus;

  @Column()
  reportedDate: Date;

  @Column()
  reportedTime: string;

  @Column({ nullable: true })
  assignedDate: Date;

  @Column({ nullable: true })
  assignedTime: string;

  @Column({ nullable: true })
  resolvedDate: Date;

  @Column({ nullable: true })
  resolvedTime: string;

  @Column({ nullable: true })
  resolutionDuration: string; // Format: "2h 30m"

  @Column({ nullable: true })
  reportedBy: string;

  @Column('text', { nullable: true })
  diagnosis: string;

  @Column('text', { nullable: true })
  solution: string;

  @Column('text', { nullable: true })
  internalComments: string;

  @Column({ nullable: true })
  attachments: string; // JSON array of file paths

  @ManyToOne(() => User, (user) => user.interventions)
  @JoinColumn({ name: 'technicianId' })
  technician: User;

  @Column('uuid', { nullable: true })
  technicianId: string;

  @ManyToOne(() => Department, (dept) => dept.interventions)
  @JoinColumn({ name: 'departmentId' })
  department: Department;

  @Column('uuid')
  departmentId: string;

  @OneToMany(() => InventoryUsage, (usage) => usage.intervention)
  inventoryUsages: InventoryUsage[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Calculated field
  get durationInMinutes(): number | null {
    if (!this.reportedDate || !this.resolvedDate) return null;
    return Math.floor(
      (this.resolvedDate.getTime() - this.reportedDate.getTime()) / (1000 * 60),
    );
  }
}
