import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Report, ReportType, Intervention, User, InventoryItem } from '@/database/entities';
import { GenerateReportDto } from './reports.dto';

@Injectable()
export class ReportsService {
  constructor(
    @InjectRepository(Report)
    private reportsRepository: Repository<Report>,
    @InjectRepository(Intervention)
    private interventionRepository: Repository<Intervention>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(InventoryItem)
    private inventoryRepository: Repository<InventoryItem>,
  ) {}

  async generateReport(generateDto: GenerateReportDto, userId: string): Promise<Report> {
    const { type, startDate, endDate } = generateDto;

    let start = new Date();
    let end = new Date();
    let period = '';

    if (type === ReportType.DAILY) {
      start.setHours(0, 0, 0, 0);
      end.setHours(23, 59, 59, 999);
      period = start.toISOString().split('T')[0];
    } else if (type === ReportType.WEEKLY) {
      start.setDate(start.getDate() - start.getDay());
      start.setHours(0, 0, 0, 0);
      end.setDate(start.getDate() + 6);
      end.setHours(23, 59, 59, 999);
      const weekNum = this.getWeekNumber(start);
      period = `${start.getFullYear()}-W${String(weekNum).padStart(2, '0')}`;
    } else if (type === ReportType.MONTHLY) {
      start = new Date(start.getFullYear(), start.getMonth(), 1);
      end = new Date(start.getFullYear(), start.getMonth() + 1, 0);
      period = `${start.getFullYear()}-${String(start.getMonth() + 1).padStart(2, '0')}`;
    }

    const interventions = await this.interventionRepository.find({
      where: {
        createdAt: Between(start, end),
      },
      relations: ['technician', 'department', 'inventoryUsages'],
    });

    const data = await this.compileReportData(interventions, type);

    const report = this.reportsRepository.create({
      type,
      period,
      title: `${type.charAt(0).toUpperCase() + type.slice(1)} Report - ${period}`,
      data,
      generatedBy: userId,
    });

    return this.reportsRepository.save(report);
  }

  async findAll(type?: ReportType) {
    const where = type ? { type } : {};
    return this.reportsRepository.find({
      where,
      order: { generatedAt: 'DESC' },
    });
  }

  async findById(id: string): Promise<Report> {
    return this.reportsRepository.findOne({
      where: { id },
    });
  }

  async publishReport(id: string): Promise<Report> {
    const report = await this.findById(id);
    report.isPublished = true;
    report.publishedAt = new Date();
    return this.reportsRepository.save(report);
  }

  private async compileReportData(interventions: Intervention[], type: ReportType) {
    const stats = {
      totalInterventions: interventions.length,
      resolvedInterventions: interventions.filter((i) => i.status === 'resolved').length,
      pendingInterventions: interventions.filter((i) => i.status === 'pending').length,
      inProgressInterventions: interventions.filter((i) => i.status === 'in_progress')
        .length,
      escalatedInterventions: interventions.filter((i) => i.status === 'escalated').length,
    };

    const avgResolutionTime = this.calculateAverageResolutionTime(interventions);

    const technicianStats = this.compileTechnicianStats(interventions);
    const departmentStats = this.compileDepartmentStats(interventions);
    const categoryStats = this.compileCategoryStats(interventions);
    const priorityStats = this.compilePriorityStats(interventions);

    const equipmentUsed = this.compileEquipmentUsage(interventions);

    const alerts = this.generateAlerts(interventions, stats);

    return {
      stats,
      avgResolutionTime,
      technicianStats,
      departmentStats,
      categoryStats,
      priorityStats,
      equipmentUsed,
      alerts,
      interventionDetails: interventions.map((i) => ({
        ticketNumber: i.ticketNumber,
        title: i.title,
        category: i.category,
        priority: i.priority,
        status: i.status,
        reportedDate: i.reportedDate,
        resolvedDate: i.resolvedDate,
        resolutionDuration: i.resolutionDuration,
        technician: i.technician?.fullName,
        department: i.department?.name,
        description: i.description,
        solution: i.solution,
      })),
    };
  }

  private calculateAverageResolutionTime(interventions: Intervention[]): string {
    const resolved = interventions.filter((i) => i.durationInMinutes !== null);
    if (resolved.length === 0) return 'N/A';

    const totalMinutes = resolved.reduce((sum, i) => sum + (i.durationInMinutes || 0), 0);
    const avgMinutes = Math.floor(totalMinutes / resolved.length);
    const hours = Math.floor(avgMinutes / 60);
    const minutes = avgMinutes % 60;

    return `${hours}h ${minutes}m`;
  }

  private compileTechnicianStats(interventions: Intervention[]) {
    const stats: Record<
      string,
      { name: string; count: number; resolved: number; avgResolutionTime: string }
    > = {};

    interventions.forEach((i) => {
      if (i.technician) {
        if (!stats[i.technician.id]) {
          stats[i.technician.id] = {
            name: i.technician.fullName,
            count: 0,
            resolved: 0,
            avgResolutionTime: 'N/A',
          };
        }
        stats[i.technician.id].count++;
        if (i.status === 'resolved') {
          stats[i.technician.id].resolved++;
        }
      }
    });

    return Object.values(stats);
  }

  private compileDepartmentStats(interventions: Intervention[]) {
    const stats: Record<string, { name: string; count: number }> = {};

    interventions.forEach((i) => {
      if (i.department) {
        if (!stats[i.department.id]) {
          stats[i.department.id] = {
            name: i.department.name,
            count: 0,
          };
        }
        stats[i.department.id].count++;
      }
    });

    return Object.values(stats).sort((a, b) => b.count - a.count);
  }

  private compileCategoryStats(interventions: Intervention[]) {
    const stats: Record<string, number> = {};

    interventions.forEach((i) => {
      stats[i.category] = (stats[i.category] || 0) + 1;
    });

    return stats;
  }

  private compilePriorityStats(interventions: Intervention[]) {
    const stats: Record<string, number> = {};

    interventions.forEach((i) => {
      stats[i.priority] = (stats[i.priority] || 0) + 1;
    });

    return stats;
  }

  private compileEquipmentUsage(interventions: Intervention[]) {
    const equipment: Record<string, number> = {};

    interventions.forEach((i) => {
      i.inventoryUsages?.forEach((usage) => {
        const key = usage.inventoryItem?.name || 'Unknown';
        equipment[key] = (equipment[key] || 0) + usage.quantity;
      });
    });

    return equipment;
  }

  private generateAlerts(interventions: Intervention[], stats: any) {
    const alerts: string[] = [];

    if (stats.escalatedInterventions > stats.totalInterventions * 0.1) {
      alerts.push(
        `High escalation rate: ${((stats.escalatedInterventions / stats.totalInterventions) * 100).toFixed(1)}%`,
      );
    }

    const criticalCount = interventions.filter((i) => i.priority === 'critical').length;
    if (criticalCount > 0) {
      alerts.push(`${criticalCount} critical interventions in this period`);
    }

    if (stats.pendingInterventions > 10) {
      alerts.push(`${stats.pendingInterventions} interventions still pending`);
    }

    return alerts;
  }

  private getWeekNumber(date: Date): number {
    const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
    const pastDaysOfYear = (date.getTime() - firstDayOfYear.getTime()) / 86400000;
    return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
  }
}
