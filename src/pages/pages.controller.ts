import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { PagesService } from './pages.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { Roles } from 'src/auth/roles.decorator';
import { PageDto } from './dto/page.dto';

@Controller('page')
export class PagesController {
  constructor(private readonly pagesService: PagesService) {}

  @UseGuards(AuthGuard)
  @Get('get-all')
  getPages() {
    return this.pagesService.getPages();
  }

  @UsePipes(new ValidationPipe())
  @UseGuards(AuthGuard)
  @Roles('dev', 'owner')
  @Post('add')
  addPage(@Body() pageDTO: PageDto) {
    return this.pagesService.addPage(pageDTO);
  }

  @UseGuards(AuthGuard)
  @Roles('dev', 'owner')
  @Delete('del/:pageId')
  delPage(@Param('pageId') pageId: string) {
    return this.pagesService.delPage(Number(pageId));
  }

  @UsePipes(new ValidationPipe())
  @UseGuards(AuthGuard)
  @Roles('dev', 'owner')
  @Put('edit/:pageId')
  editPage(@Param('pageId') pageId: string, @Body() pageDTO: PageDto) {
    return this.pagesService.editPage(Number(pageId), pageDTO);
  }
}
