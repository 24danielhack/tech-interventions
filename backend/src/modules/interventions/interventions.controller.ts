import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  UseGuards,
  Query,
  Req,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { InterventionsService } from './interventions.service';
import {
  CreateInterventionDto,
  UpdateInterventionDto,
  ResolveInterventionDto,
  FilterInterventionsDto,
} from './interventions.dto';
import { JwtAuthGuard } from '@/guards/jwt-auth.guard';
import { RolesGuard } from '@/guards/roles.guard';
import { Roles } from '@/decorators/roles.decorator';
import { CurrentUser } from '@/decorators/current-user.decorator';
import { UserRole } from '@/database/entities';

@ApiTags('Interventions')
@Controller('interventions')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class InterventionsController {
  constructor(private interventionsService: InterventionsService) {}

  @Post()
  @Roles(UserRole.ADMIN, UserRole.MANAGER, UserRole.TECHNICIAN)
  async create(@Body() createDto: CreateInterventionDto, @CurrentUser() user) {
    return this.interventionsService.create(createDto);
  }

  @Get()
  @Roles(UserRole.ADMIN, UserRole.MANAGER, UserRole.TECHNICIAN, UserRole.OBSERVER)
  async findAll(@Query() filters: FilterInterventionsDto) {
    return this.interventionsService.findAll(filters);
  }

  @Get('stats')
  @Roles(UserRole.ADMIN, UserRole.MANAGER, UserRole.OBSERVER)
  async getStats(@Query('startDate') startDate?: string, @Query('endDate') endDate?: string) {
    return this.interventionsService.getStats(
      startDate ? new Date(startDate) : undefined,
      endDate ? new Date(endDate) : undefined,
    );
  }

  @Get(':id')
  @Roles(UserRole.ADMIN, UserRole.MANAGER, UserRole.TECHNICIAN, UserRole.OBSERVER)
  async findById(@Param('id') id: string) {
    return this.interventionsService.findById(id);
  }

  @Put(':id')
  @Roles(UserRole.ADMIN, UserRole.MANAGER, UserRole.TECHNICIAN)
  async update(@Param('id') id: string, @Body() updateDto: UpdateInterventionDto) {
    return this.interventionsService.update(id, updateDto);
  }

  @Post(':id/resolve')
  @Roles(UserRole.ADMIN, UserRole.MANAGER, UserRole.TECHNICIAN)
  async resolve(@Param('id') id: string, @Body() resolveDto: ResolveInterventionDto) {
    return this.interventionsService.resolve(id, resolveDto);
  }

  @Post(':id/assign')
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  async assign(@Param('id') id: string, @Body('technicianId') technicianId: string) {
    return this.interventionsService.assign(id, technicianId);
  }

  @Post(':id/escalate')
  @Roles(UserRole.ADMIN, UserRole.MANAGER, UserRole.TECHNICIAN)
  async escalate(@Param('id') id: string, @Body('reason') reason: string) {
    return this.interventionsService.escalate(id, reason);
  }
}
