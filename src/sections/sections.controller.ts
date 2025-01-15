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
import { AuthGuard } from 'src/auth/auth.guard';
import { SectionsService } from './sections.service';
import { Roles } from 'src/auth/roles.decorator';
import { SectionDto } from './dto/section.dto';

@Controller('section')
export class SectionsController {
  constructor(private readonly sectionsService: SectionsService) {}

  @UseGuards(AuthGuard)
  @Get('get-all/:pageId/:lang')
  getPages(@Param('pageId') pageId: string, @Param('lang') lang: string) {
    return this.sectionsService.getSections(Number(pageId), lang);
  }

  @UsePipes(new ValidationPipe())
  @UseGuards(AuthGuard)
  @Roles('dev', 'owner')
  @Post('add')
  addPage(@Body() sectionDTO: SectionDto) {
    return this.sectionsService.addSection(sectionDTO);
  }

  @UseGuards(AuthGuard)
  @Roles('dev', 'owner')
  @Delete('del/:sectionId')
  delPage(@Param('sectionId') sectionId: string) {
    return this.sectionsService.delSection(Number(sectionId));
  }

  @UsePipes(new ValidationPipe())
  @UseGuards(AuthGuard)
  @Roles('dev', 'owner')
  @Put('edit/:sectionId')
  editPage(
    @Param('sectionId') sectionId: string,
    @Body() sectionDTO: SectionDto,
  ) {
    return this.sectionsService.editSection(Number(sectionId), sectionDTO);
  }
}
