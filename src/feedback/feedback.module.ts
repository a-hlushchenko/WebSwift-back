import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { FeedbackService } from './feedback.service';
import { FeedbackController } from './feedback.controller';
import { AdminsModule } from 'src/admins/admins.module';
import { TelegramModule } from 'src/telegram/telegram.module';

@Module({
  controllers: [FeedbackController],
  providers: [FeedbackService, PrismaService],
  imports: [AdminsModule, TelegramModule],
})
export class FeedbackModule {}
