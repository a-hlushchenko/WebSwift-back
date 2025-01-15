import { Injectable, UnauthorizedException } from '@nestjs/common';
import { LoginAuthDto } from './dto/login-auth.dto';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'src/prisma.service';
import { AdminsService } from 'src/admins/admins.service';
import { JwtService } from '@nestjs/jwt';
import { FetchAuthDto } from './dto/fetch-auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly adminsService: AdminsService,
    private readonly jwtService: JwtService,
  ) {}

  async create() {}

  async login(loginAuthDto: LoginAuthDto) {
    try {
      const { login, password, role, id } = await this.adminsService.findOne(
        loginAuthDto.login,
      );

      const isMatch = await bcrypt.compare(loginAuthDto.password, password);

      if (isMatch) {
        const payload = { sub: id, login, role };

        const accessToken = await this.jwtService.signAsync(payload);

        const refreshToken = await this.jwtService.signAsync(payload, {
          secret: process.env.JWT_REFRESH_SECRET,
          expiresIn: '7d',
        });

        await this.adminsService.updateRefreshToken(id, refreshToken);

        return {
          token: accessToken,
          refreshToken,
          user: {
            login,
            role,
          },
        };
      } else {
        throw new UnauthorizedException('Invalid login or password');
      }
    } catch (e) {
      throw new UnauthorizedException('Invalid login or password');
    }
  }
}
