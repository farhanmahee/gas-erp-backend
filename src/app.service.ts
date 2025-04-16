import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }
}

export const AppDataSource = new DataSource({
    type: "postgres", // Change to your database type (e.g., mysql, sqlite)
    host: "localhost",
    port: 5432, // Default PostgreSQL port
    username: "your_username",
    password: "your_password",
    database: "your_database",
    synchronize: true, // Set to false in production
    logging: false,
    entities: ["src/entity/**/*.ts"], // Path to your entities
    migrations: ["src/migration/**/*.ts"], // Path to your migrations
    subscribers: ["src/subscriber/**/*.ts"], // Path to your subscribers
});
