import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { config } from 'dotenv';
import { join } from 'path';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './entity/User';

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
@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  );
  async validateUser(email: string, pass: string): Promise<User | null> {
    const user = await this.userRepository.findOne({ where: { email } });
    if (user && bcrypt.compareSync(pass, user.password)) { return user; }
    return null;
  }

  async validateUserById(id: number): Promise<User | null> {
    return this.userRepository.findOne({ where: { id } });
  }

  async login(user: User) {
    const payload = { email: user.email, sub: user.id, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
