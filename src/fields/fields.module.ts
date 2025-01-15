import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { FieldsService } from './fields.service';
import { FieldsController } from './fields.controller';
import { AdminsModule } from 'src/admins/admins.module';

@Module({
  controllers: [FieldsController],
  providers: [FieldsService, PrismaService],
  imports: [AdminsModule],
})
export class FieldsModule {}
