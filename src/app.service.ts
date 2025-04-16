import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import { join } from 'path';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }
}

// Load environment variables
config();

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  username: process.env.DB_USERNAME || 'Admin', // Fixed: DB_NAME to DB_USERNAME
  password: process.env.DB_PASS || 'Mahee@123',
  database: process.env.DB_NAME || 'postgres', // Added default database name
  synchronize: process.env.NODE_ENV !== 'production',
  logging: process.env.NODE_ENV === 'development',
  entities: [join(__dirname, 'entity', '**', '*.{ts,js}')],
  migrations: [join(__dirname, 'migration', '**', '*.{ts,js}')],
  subscribers: [join(__dirname, 'subscriber', '**', '*.{ts,js}')],
  ssl: process.env.NODE_ENV === 'production'
    ? { rejectUnauthorized: false }
    : false,
});

// Initialize connection
AppDataSource.initialize()
  .then(() => {
    console.log('Data Source has been initialized!');
  })
  .catch((err) => {
    console.error('Error during Data Source initialization:', err);
  });
