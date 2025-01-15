import { Controller, Get } from '@nestjs/common';
import { ContentService } from './content.service';

@Controller('content')
export class ContentController {
  constructor(private readonly contentService: ContentService) {}

  @Get('en')
  getEn() {
    return this.contentService.getContent('en');
  }

  @Get('ua')
  getUa() {
    return this.contentService.getContent('ua');
  }
}
