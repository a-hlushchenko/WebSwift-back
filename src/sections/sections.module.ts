import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { SectionsService } from './sections.service';
import { SectionsController } from './sections.controller';
import { AdminsModule } from 'src/admins/admins.module';

@Module({
  controllers: [SectionsController],
  providers: [SectionsService, PrismaService],
  imports: [AdminsModule],
})
export class SectionsModule {}
