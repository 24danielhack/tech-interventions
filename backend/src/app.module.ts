import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { InterventionsModule } from './modules/interventions/interventions.module';
import { StockModule } from './modules/stock/stock.module';
import { TechniciansModule } from './modules/technicians/technicians.module';
import { DepartmentsModule } from './modules/departments/departments.module';
import { ReportsModule } from './modules/reports/reports.module';
import { ExportsModule } from './modules/exports/exports.module';
import { TypeOrmConfigService } from './database/typeorm-config.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useClass: TypeOrmConfigService,
    }),
    AuthModule,
    InterventionsModule,
    StockModule,
    TechniciansModule,
    DepartmentsModule,
    ReportsModule,
    ExportsModule,
  ],
})
export class AppModule {}
