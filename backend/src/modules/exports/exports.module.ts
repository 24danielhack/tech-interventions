import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Intervention, InventoryItem, Report, InventoryUsage } from '@/database/entities';
import { ExportsService } from './exports.service';
import { ExportsController } from './exports.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Intervention, InventoryItem, Report, InventoryUsage])],
  controllers: [ExportsController],
  providers: [ExportsService],
  exports: [ExportsService],
})
export class ExportsModule {}
