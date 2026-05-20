import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Intervention, InventoryItem, Report, InventoryUsage } from '@/database/entities';
import * as XLSX from 'xlsx';
import * as csv from 'csv-stringify/sync';

@Injectable()
export class ExportsService {
  constructor(
    @InjectRepository(Intervention)
    private interventionRepository: Repository<Intervention>,
    @InjectRepository(InventoryItem)
    private inventoryRepository: Repository<InventoryItem>,
    @InjectRepository(Report)
    private reportRepository: Repository<Report>,
    @InjectRepository(InventoryUsage)
    private usageRepository: Repository<InventoryUsage>,
  ) {}

  async generateInterventionsCSV(startDate?: Date, endDate?: Date): Promise<string> {
    const interventions = await this.interventionRepository.find({
      where: startDate && endDate ? { createdAt: Between(startDate, endDate) } : undefined,
      relations: ['technician', 'department'],
    });

    const records = interventions.map((i) => ({
      'Ticket Number': i.ticketNumber,
      'Title': i.title,
      'Category': i.category,
      'Priority': i.priority,
      'Status': i.status,
      'Reported Date': i.reportedDate,
      'Reported Time': i.reportedTime,
      'Reported By': i.reportedBy,
      'Department': i.department?.name,
      'Technician': i.technician?.fullName,
      'Description': i.description,
      'Diagnosis': i.diagnosis,
      'Solution': i.solution,
      'Resolution Duration': i.resolutionDuration,
      'Resolved Date': i.resolvedDate,
      'Resolved Time': i.resolvedTime,
      'Internal Comments': i.internalComments,
    }));

    return csv.stringify(records, { header: true });
  }

  async generateInterventionsExcel(startDate?: Date, endDate?: Date): Promise<Buffer> {
    const interventions = await this.interventionRepository.find({
      where: startDate && endDate ? { createdAt: Between(startDate, endDate) } : undefined,
      relations: ['technician', 'department'],
    });

    const records = interventions.map((i) => ({
      'Ticket Number': i.ticketNumber,
      'Title': i.title,
      'Category': i.category,
      'Priority': i.priority,
      'Status': i.status,
      'Reported Date': i.reportedDate,
      'Reported Time': i.reportedTime,
      'Reported By': i.reportedBy,
      'Department': i.department?.name,
      'Technician': i.technician?.fullName,
      'Description': i.description,
      'Diagnosis': i.diagnosis,
      'Solution': i.solution,
      'Resolution Duration': i.resolutionDuration,
    }));

    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(records);

    // Auto-size columns
    const colWidths = [
      { wch: 15 }, // Ticket Number
      { wch: 25 }, // Title
      { wch: 15 }, // Category
      { wch: 10 }, // Priority
      { wch: 12 }, // Status
      { wch: 12 }, // Reported Date
      { wch: 12 }, // Reported Time
      { wch: 15 }, // Reported By
      { wch: 18 }, // Department
      { wch: 18 }, // Technician
      { wch: 35 }, // Description
      { wch: 25 }, // Diagnosis
      { wch: 25 }, // Solution
      { wch: 15 }, // Resolution Duration
    ];

    worksheet['!cols'] = colWidths;
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Interventions');

    const buffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'buffer' });
    return buffer;
  }

  async generateInterventionsPDF(startDate?: Date, endDate?: Date): Promise<Buffer> {
    const interventions = await this.interventionRepository.find({
      where: startDate && endDate ? { createdAt: Between(startDate, endDate) } : undefined,
      relations: ['technician', 'department'],
    });

    let pdfContent = `INTERVENTIONS REPORT\nGenerated: ${new Date().toLocaleString()}\n\n`;
    pdfContent += `Total Interventions: ${interventions.length}\n\n`;

    interventions.forEach((i, idx) => {
      pdfContent += `${idx + 1}. ${i.ticketNumber} - ${i.title}\n`;
      pdfContent += `   Category: ${i.category}\n`;
      pdfContent += `   Priority: ${i.priority}\n`;
      pdfContent += `   Status: ${i.status}\n`;
      pdfContent += `   Department: ${i.department?.name}\n`;
      pdfContent += `   Technician: ${i.technician?.fullName}\n`;
      pdfContent += `   Duration: ${i.resolutionDuration}\n\n`;
    });

    return Buffer.from(pdfContent);
  }

  async generateInventoryCSV(): Promise<string> {
    const items = await this.inventoryRepository.find();

    const records = items.map((item) => ({
      'Name': item.name,
      'Category': item.category,
      'Serial Number': item.serialNumber,
      'Quantity Available': item.quantityAvailable,
      'Quantity Total': item.quantityTotal,
      'Condition': item.condition,
      'Location': item.location,
      'Supplier': item.supplier,
      'Unit Cost': item.unitCost,
      'Total Value': item.totalValue,
      'Low Stock Threshold': item.lowStockThreshold,
      'Is Low Stock': item.isLowStock ? 'YES' : 'NO',
      'Description': item.description,
    }));

    return csv.stringify(records, { header: true });
  }

  async generateReportCSV(reportId: string): Promise<string> {
    const report = await this.reportRepository.findOne({
      where: { id: reportId },
    });

    if (!report) {
      return '';
    }

    const records = [];

    // Header with report info
    records.push({
      'Report Type': report.type,
      'Period': report.period,
      'Generated': report.generatedAt,
      'Published': report.isPublished ? 'YES' : 'NO',
    });

    records.push({}); // Empty row

    // Statistics
    if (report.data.stats) {
      records.push({ 'STATISTICS': '' });
      Object.entries(report.data.stats).forEach(([key, value]) => {
        records.push({ [key]: value });
      });
    }

    records.push({}); // Empty row

    // Technician Stats
    if (report.data.technicianStats) {
      records.push({ 'TECHNICIAN PERFORMANCE': '' });
      report.data.technicianStats.forEach((tech) => {
        records.push({
          'Technician': tech.name,
          'Total': tech.count,
          'Resolved': tech.resolved,
        });
      });
    }

    records.push({}); // Empty row

    // Intervention Details
    if (report.data.interventionDetails) {
      records.push({ 'INTERVENTION DETAILS': '' });
      records.push({});
      report.data.interventionDetails.forEach((detail) => {
        records.push(detail);
      });
    }

    return csv.stringify(records, { header: true });
  }

  /**
   * Generate comprehensive IA-ready CSV with all relevant data
   * Optimized for Claude.ai and other AI models for analysis
   */
  async generateComprehensiveCSV(startDate?: Date, endDate?: Date): Promise<string> {
    const interventions = await this.interventionRepository.find({
      where: startDate && endDate ? { reportedDate: Between(startDate, endDate) } : undefined,
      relations: ['technician', 'department', 'inventoryUsages', 'inventoryUsages.inventoryItem'],
    });

    const inventory = await this.inventoryRepository.find();

    const records = [];

    // HEADER SECTION - Metadata
    records.push({
      'SECTION': 'METADATA',
      'Report Type': 'COMPREHENSIVE_EXPORT',
      'Generated': new Date().toISOString(),
      'Date Range': `${startDate?.toISOString() || 'All'} to ${endDate?.toISOString() || 'All'}`,
    });

    records.push({}); // Empty row

    // SUMMARY STATISTICS
    records.push({ 'SECTION': 'SUMMARY_STATISTICS' });
    const totalInterventions = interventions.length;
    const resolvedCount = interventions.filter((i) => i.status === 'resolved').length;
    const avgResolution = this.calculateAvgResolutionTime(interventions);
    const criticalCount = interventions.filter((i) => i.priority === 'critical').length;
    const escalatedCount = interventions.filter((i) => i.status === 'escalated').length;

    records.push({
      'Metric': 'Total Interventions',
      'Value': totalInterventions,
    });
    records.push({
      'Metric': 'Resolved Interventions',
      'Value': resolvedCount,
      'Percentage': `${((resolvedCount / totalInterventions) * 100).toFixed(2)}%`,
    });
    records.push({
      'Metric': 'Average Resolution Time',
      'Value': avgResolution,
    });
    records.push({
      'Metric': 'Critical Interventions',
      'Value': criticalCount,
    });
    records.push({
      'Metric': 'Escalated Interventions',
      'Value': escalatedCount,
    });

    records.push({}); // Empty row

    // DETAILED INTERVENTIONS
    records.push({ 'SECTION': 'DETAILED_INTERVENTIONS' });
    records.push({}); // Empty row

    interventions.forEach((i) => {
      records.push({
        'Type': 'INTERVENTION',
        'Ticket Number': i.ticketNumber,
        'Title': i.title,
        'Description': i.description,
        'Category': i.category,
        'Priority': i.priority,
        'Status': i.status,
        'Reported Date': i.reportedDate?.toISOString(),
        'Reported Time': i.reportedTime,
        'Reported By': i.reportedBy,
        'Department': i.department?.name,
        'Department ID': i.department?.id,
        'Technician': i.technician?.fullName,
        'Technician ID': i.technician?.id,
        'Email': i.technician?.email,
        'Diagnosis': i.diagnosis,
        'Solution': i.solution,
        'Resolution Duration (minutes)': i.durationInMinutes,
        'Assigned Date': i.assignedDate?.toISOString(),
        'Resolved Date': i.resolvedDate?.toISOString(),
        'Internal Comments': i.internalComments,
        'Created At': i.createdAt?.toISOString(),
      });

      // Equipment used in this intervention
      if (i.inventoryUsages && i.inventoryUsages.length > 0) {
        i.inventoryUsages.forEach((usage) => {
          records.push({
            'Type': 'EQUIPMENT_USED',
            'Equipment Name': usage.inventoryItem?.name,
            'Equipment Category': usage.inventoryItem?.category,
            'Quantity Used': usage.quantity,
            'Serial Number': usage.inventoryItem?.serialNumber,
            'Reason': usage.reason,
          });
        });
      }

      records.push({}); // Empty row after each intervention
    });

    // INVENTORY STATUS
    records.push({ 'SECTION': 'INVENTORY_STATUS' });
    records.push({}); // Empty row

    inventory.forEach((item) => {
      records.push({
        'Type': 'INVENTORY_ITEM',
        'Name': item.name,
        'Category': item.category,
        'Serial Number': item.serialNumber,
        'Quantity Available': item.quantityAvailable,
        'Quantity Total': item.quantityTotal,
        'Condition': item.condition,
        'Location': item.location,
        'Supplier': item.supplier,
        'Unit Cost': item.unitCost,
        'Total Value': item.totalValue,
        'Low Stock Threshold': item.lowStockThreshold,
        'Is Low Stock': item.isLowStock ? 'YES' : 'NO',
        'Description': item.description,
        'Added Date': item.addedDate?.toISOString(),
      });
    });

    records.push({}); // Empty row

    // ANALYSIS & RECOMMENDATIONS
    records.push({ 'SECTION': 'ANALYSIS_AND_RECOMMENDATIONS' });
    records.push({}); // Empty row

    const lowStockItems = inventory.filter((i) => i.isLowStock);
    records.push({
      'Recommendation': 'Low Stock Alert',
      'Count': lowStockItems.length,
      'Items': lowStockItems.map((i) => i.name).join(', '),
    });

    const defectiveItems = inventory.filter((i) => i.condition === 'defective');
    records.push({
      'Recommendation': 'Defective Equipment',
      'Count': defectiveItems.length,
      'Items': defectiveItems.map((i) => i.name).join(', '),
    });

    if (escalatedCount > 0) {
      records.push({
        'Recommendation': 'Escalated Cases Review',
        'Count': escalatedCount,
        'Action': 'Review escalated interventions for systemic issues',
      });
    }

    records.push({
      'Recommendation': 'Performance Metric',
      'Value': `${((resolvedCount / totalInterventions) * 100).toFixed(2)}% resolution rate`,
      'Target': '95%',
      'Status': ((resolvedCount / totalInterventions) * 100 >= 95) ? 'MET' : 'BELOW_TARGET',
    });

    return csv.stringify(records, { header: true });
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
