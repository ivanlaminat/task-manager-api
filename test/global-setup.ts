import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
dotenv.config();

module.exports = async () => {
  const dataSource = new DataSource({
    type: process.env.DB_TYPE as any,
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT!),
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    migrations: ['src/migrations/*{.ts,.js}'],
  });
  await dataSource.initialize();
  await dataSource.runMigrations();
  await dataSource.destroy();
};
