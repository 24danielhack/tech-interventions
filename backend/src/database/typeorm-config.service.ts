import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import {
  User,
  Department,
  Intervention,
  InventoryItem,
  InventoryUsage,
  Alert,
  Report,
} from './entities';

@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
  constructor(private configService: ConfigService) {}

  createTypeOrmOptions(): TypeOrmModuleOptions {
    return {
      type: 'postgres',
      host: this.configService.get('DB_HOST', 'localhost'),
      port: this.configService.get('DB_PORT', 5432),
      username: this.configService.get('DB_USERNAME', 'admin'),
      password: this.configService.get('DB_PASSWORD', 'password123'),
      database: this.configService.get('DB_NAME', 'tech_interventions'),
      entities: [
        User,
        Department,
        Intervention,
        InventoryItem,
        InventoryUsage,
        Alert,
        Report,
      ],
      synchronize: this.configService.get('NODE_ENV') === 'development',
      logging: this.configService.get('NODE_ENV') === 'development',
      dropSchema: false,
    };
  }
}
