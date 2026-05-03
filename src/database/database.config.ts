import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';

export const getDatabaseConfig = (
  config: ConfigService,
): TypeOrmModuleOptions => ({
  type: config.get<'mysql' | 'postgres'>('DB_TYPE', 'mysql'),
  host: config.get<string>('DB_HOST', 'localhost'),
  port: config.get<number>('DB_PORT', 3306),
  username: config.get<string>('DB_USER', 'root'),
  password: config.get<string>('DB_PASS', 'root'),
  database: config.get<string>('DB_NAME', 'taskmanager'),
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  migrations: [__dirname + '/../migrations/*{.ts,.js}'],
  synchronize: false, // В продакшене используем миграции
  logging: config.get<string>('NODE_ENV') === 'development',
});
