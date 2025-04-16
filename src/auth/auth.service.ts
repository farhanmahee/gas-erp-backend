import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '../entity/User'; // Adjust the path to your User entity
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  async validateUser(email: string, pass: string): Promise<User | null> {
    const user = await User.findOne({ where: { email } }); // Fetch user by email
    if (user && bcrypt.compareSync(pass, user.password)) {
      return user; // Return user if password matches
    }
    return null; // Return null if validation fails
  }

  async login(user: User) {
    const payload = { email: user.email, sub: user.id, role: user.role }; // Include role in payload
    return {
      access_token: this.jwtService.sign(payload), // Generate JWT token
    };
  }
}