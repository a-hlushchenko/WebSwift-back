import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { ContentService } from './content.service';
import { ContentController } from './content.controller';
import { AdminsModule } from 'src/admins/admins.module';

@Module({
  controllers: [ContentController],
  providers: [ContentService, PrismaService],
  imports: [AdminsModule],
})
export class ContentModule {}
