import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { join } from 'path';
import {
  User,
  Department,
  Intervention,
  InventoryItem,
  InventoryUsage,
  Alert,
  Report,
} from './entities';

export const getTypeOrmConfig = (): TypeOrmModuleOptions => {
  return {
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT) || 5432,
    username: process.env.DB_USERNAME || 'admin',
    password: process.env.DB_PASSWORD || 'password123',
    database: process.env.DB_NAME || 'tech_interventions',
    entities: [
      User,
      Department,
      Intervention,
      InventoryItem,
      InventoryUsage,
      Alert,
      Report,
    ],
    migrations: [join(__dirname, '../database/migrations/*.ts')],
    synchronize: process.env.NODE_ENV === 'development',
    logging: process.env.NODE_ENV === 'development',
    dropSchema: false,
  };
};
