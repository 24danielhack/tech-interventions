import { Controller, Get, Query, UseGuards, Res } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { ExportsService } from './exports.service';
import { JwtAuthGuard } from '@/guards/jwt-auth.guard';
import { RolesGuard } from '@/guards/roles.guard';
import { Roles } from '@/decorators/roles.decorator';
import { UserRole } from '@/database/entities';
import { Response } from 'express';

@ApiTags('Exports')
@Controller('exports')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class ExportsController {
  constructor(private exportsService: ExportsService) {}

  @Get('interventions/csv')
  @Roles(UserRole.ADMIN, UserRole.MANAGER, UserRole.OBSERVER)
  async exportInterventionsCSV(
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Res() res?: Response,
  ) {
    const csv = await this.exportsService.generateInterventionsCSV(
      startDate ? new Date(startDate) : undefined,
      endDate ? new Date(endDate) : undefined,
    );

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=interventions.csv');
    res.send(csv);
  }

  @Get('interventions/excel')
  @Roles(UserRole.ADMIN, UserRole.MANAGER, UserRole.OBSERVER)
  async exportInterventionsExcel(
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Res() res?: Response,
  ) {
    const buffer = await this.exportsService.generateInterventionsExcel(
      startDate ? new Date(startDate) : undefined,
      endDate ? new Date(endDate) : undefined,
    );

    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    );
    res.setHeader('Content-Disposition', 'attachment; filename=interventions.xlsx');
    res.send(buffer);
  }

  @Get('interventions/pdf')
  @Roles(UserRole.ADMIN, UserRole.MANAGER, UserRole.OBSERVER)
  async exportInterventionsPDF(
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Res() res?: Response,
  ) {
    const buffer = await this.exportsService.generateInterventionsPDF(
      startDate ? new Date(startDate) : undefined,
      endDate ? new Date(endDate) : undefined,
    );

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=interventions.pdf');
    res.send(buffer);
  }

  @Get('inventory/csv')
  @Roles(UserRole.ADMIN, UserRole.MANAGER, UserRole.OBSERVER)
  async exportInventoryCSV(@Res() res?: Response) {
    const csv = await this.exportsService.generateInventoryCSV();

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=inventory.csv');
    res.send(csv);
  }

  @Get('reports/csv')
  @Roles(UserRole.ADMIN, UserRole.MANAGER, UserRole.OBSERVER)
  async exportReportsCSV(
    @Query('reportId') reportId: string,
    @Res() res?: Response,
  ) {
    const csv = await this.exportsService.generateReportCSV(reportId);

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=report.csv');
    res.send(csv);
  }

  @Get('comprehensive/csv')
  @Roles(UserRole.ADMIN, UserRole.MANAGER, UserRole.OBSERVER)
  async exportComprehensiveCSV(
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Res() res?: Response,
  ) {
    const csv = await this.exportsService.generateComprehensiveCSV(
      startDate ? new Date(startDate) : undefined,
      endDate ? new Date(endDate) : undefined,
    );

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=comprehensive_export.csv');
    res.send(csv);
  }
}
