import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PrismaService } from 'src/prisma.service';
import { AdminsModule } from 'src/admins/admins.module';
import { JwtModule, JwtService } from '@nestjs/jwt';

@Module({
  imports: [
    AdminsModule,
    JwtModule.register({
      global: true,
      secret: `${process.env.JWT_SECRET_KEY}`,
      signOptions: { expiresIn: '15m' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, PrismaService],
})
export class AuthModule {}
