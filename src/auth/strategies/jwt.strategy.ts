import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthService } from '../auth.service'; // Adjust the path if necessary

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'your_secret_key', // Use environment variables in production
    });
  }

  async validate(payload: any) {
    const user = await this.authService.validateUser(payload.email);
    if (!user) {
      throw new Error('Unauthorized'); // Handle unauthorized access
    }
    return user; // Return the validated user
  }
}