import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { PagesService } from './pages.service';
import { PagesController } from './pages.controller';
import { AdminsModule } from 'src/admins/admins.module';

@Module({
  controllers: [PagesController],
  providers: [PagesService, PrismaService],
  imports: [AdminsModule],
})
export class PagesModule {}
