import { Controller, Get, Post, Param, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { ReportsService } from './reports.service';
import { GenerateReportDto } from './reports.dto';
import { JwtAuthGuard } from '@/guards/jwt-auth.guard';
import { RolesGuard } from '@/guards/roles.guard';
import { Roles } from '@/decorators/roles.decorator';
import { CurrentUser } from '@/decorators/current-user.decorator';
import { UserRole } from '@/database/entities';

@ApiTags('Reports')
@Controller('reports')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class ReportsController {
  constructor(private reportsService: ReportsService) {}

  @Post('generate')
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  async generateReport(@Body() generateDto: GenerateReportDto, @CurrentUser('id') userId: string) {
    return this.reportsService.generateReport(generateDto, userId);
  }

  @Get()
  @Roles(UserRole.ADMIN, UserRole.MANAGER, UserRole.OBSERVER)
  async findAll() {
    return this.reportsService.findAll();
  }

  @Get(':id')
  @Roles(UserRole.ADMIN, UserRole.MANAGER, UserRole.OBSERVER)
  async findById(@Param('id') id: string) {
    return this.reportsService.findById(id);
  }

  @Post(':id/publish')
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  async publishReport(@Param('id') id: string) {
    return this.reportsService.publishReport(id);
  }
}
