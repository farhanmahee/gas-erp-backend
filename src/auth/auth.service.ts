import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '../entity/User';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async validateUser(email: string, pass: string): Promise<User | null> {
    const user = await this.userRepository.findOne({ where: { email } });
    if (user && bcrypt.compareSync(pass, user.password)) {
      return user;
    }
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
