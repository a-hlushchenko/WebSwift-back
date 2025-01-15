import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AdminsService {
  constructor(private readonly prisma: PrismaService) {}

  async findOne(login: string) {
    return await this.prisma.admins.findUnique({
      where: {
        login,
      },
    });
  }

  async updateRefreshToken(userId: number, refreshToken: string) {
    const hashedToken = await bcrypt.hash(refreshToken, 10);

    await this.prisma.admins.update({
      where: { id: userId },
      data: { refresh_token: hashedToken },
    });
  }

  async create() {
    const password = '123456';
    const hash = await bcrypt.hash(password, 10);
    try {
      // const res = await this.prisma.admins.create({
      //   data: { login: 'qwerty', password: hash, role: 'owner' },
      // });
    } catch (e) {}
  }
}
