import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthLibService {
  constructor(private readonly jwtService: JwtService) {}

  public generateAccessToken(payload: object): string {
    return this.jwtService.sign(payload);
  }

  public generateRefreshToken(payload: object): string {
    return this.jwtService.sign(payload, {
      expiresIn: '7d',
    });
  }
}
