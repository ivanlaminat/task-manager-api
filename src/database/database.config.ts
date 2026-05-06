import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { Logger } from '@nestjs/common';

export const getDatabaseConfig = (
  config: ConfigService,
): TypeOrmModuleOptions => {
  const dbType = config.get<'mysql' | 'postgres'>('DB_TYPE', 'mysql');

  Logger.log(`Выбранная СУБД: ${dbType.toUpperCase()}`);

  return {
    type: dbType,
    host: config.get<string>('DB_HOST', 'localhost'),
    port: config.get<number>('DB_PORT', dbType === 'mysql' ? 3306 : 5432),
    username: config.get<string>('DB_USER', 'root'),
    password: config.get<string>('DB_PASS', 'root'),
    database: config.get<string>('DB_NAME', 'taskmanager'),
    entities: [__dirname + '/../**/*.entity{.ts,.js}'],
    migrations: [__dirname + '/../migrations/*{.ts,.js}'],
    synchronize: false,
    logging: config.get<string>('NODE_ENV') === 'development',
  };
};
