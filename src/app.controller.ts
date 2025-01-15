import { Controller, Get, Post, Body } from '@nestjs/common';

@Controller('')
export class AppController {
  constructor() {}

  @Get()
  login() {
    return { hello: 'world' };
  }
}
