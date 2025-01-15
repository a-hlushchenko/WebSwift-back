import { Controller, Get, Post, Body } from '@nestjs/common';
import { AdminsService } from './admins.service';

@Controller('admins')
export class AdminsController {
  constructor(private readonly adminsService: AdminsService) {}

  @Get()
  create() {
    return this.adminsService.create();
  }
}
