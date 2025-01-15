import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { AdminsService } from 'src/admins/admins.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private reflector: Reflector,
    private adminsService: AdminsService,
  ) {}

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException('Token not provided');
    }

    try {
      const payload = await this.jwtService.verifyAsync(token);
      request['user'] = payload;
      return this.checkRoles(context, payload.role);
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        const refreshToken = request.headers['x-refresh-token'];
        if (!refreshToken) {
          throw new UnauthorizedException('Refresh token not provided');
        }
        const newAccessToken = await this.handleRefreshToken(
          refreshToken,
          request,
        );

        response.setHeader('x-new-access-token', newAccessToken);

        return true;
      }

      throw new UnauthorizedException('Invalid token');
    }
  }

  private extractTokenFromHeader(request: Request) {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }

  private async handleRefreshToken(refreshToken: string, request: Request) {
    try {
      const payload = await this.jwtService.verifyAsync(refreshToken, {
        secret: process.env.JWT_REFRESH_SECRET,
      });
      const user = await this.adminsService.findOne(payload.login);
      if (!user) {
        throw new UnauthorizedException('Invalid refresh token');
      }
      const isMatch = await bcrypt.compare(refreshToken, user.refresh_token);

      if (!isMatch) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      const newAccessToken = await this.jwtService.signAsync({
        sub: user.id,
        login: user.login,
        role: user.role,
      });

      return newAccessToken;
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  private checkRoles(context: ExecutionContext, userRole: string): boolean {
    const requiredRoles = this.reflector.get<string[]>(
      'roles',
      context.getHandler(),
    );
    if (!requiredRoles) {
      return true;
    }
    return requiredRoles.includes(userRole);
  }
}
