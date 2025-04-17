import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import { join } from 'path';

config();

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_DATABASE || 'gas_erp',
  synchronize: process.env.NODE_ENV !== 'production',
  logging: process.env.NODE_ENV === 'development',
  entities: [join(__dirname, 'entity', '**', '*.{ts,js}')],
  migrations: [join(__dirname, 'migration', '**', '*.{ts,js}')],
  subscribers: [join(__dirname, 'subscriber', '**', '*.{ts,js}')],
  ssl:
    process.env.NODE_ENV === 'production'
      ? { rejectUnauthorized: false }
      : false,
});

AppDataSource.initialize()
  .then(() => {
    console.log('Database connected successfully!');
    // Start your application logic here
  })
  .catch((error) => console.error('Database connection failed:', error));
