import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { PageDto } from './dto/page.dto';

@Injectable()
export class PagesService {
  constructor(private readonly prisma: PrismaService) {}

  async getPages() {
    try {
      const pages = await this.prisma.pages.findMany();
      return pages;
    } catch (e) {
      throw new HttpException('Something went wrong', HttpStatus.BAD_REQUEST);
    }
  }

  async addPage(addPageDTO: PageDto) {
    try {
      const page = await this.prisma.pages.create({
        data: addPageDTO,
      });
      return page;
    } catch (e) {
      if (e.code === 'P2002' && e.meta?.target?.includes('slug')) {
        throw new HttpException(
          'Page with this slug already exists',
          HttpStatus.CONFLICT,
        );
      } else if (e.code === 'P2000') {
        throw new HttpException(
          'Name or slug is too long',
          HttpStatus.BAD_REQUEST,
        );
      }

      throw new HttpException(e.message, HttpStatus.BAD_REQUEST);
    }
  }

  async delPage(pageId: number) {
    try {
      const page = await this.prisma.pages.delete({
        where: {
          id: pageId,
        },
      });

      return {
        message: 'Page deleted successfully',
        page,
      };
    } catch (e) {
      throw new HttpException('Something went wrong', HttpStatus.BAD_REQUEST);
    }
  }

  async editPage(pageId: number, pageDTO: PageDto) {
    try {
      const page = await this.prisma.pages.update({
        where: {
          id: pageId,
        },
        data: pageDTO,
      });
      return page;
    } catch (e) {
      if (e.code === 'P2002' && e.meta?.target?.includes('slug')) {
        throw new HttpException(
          'Page with this slug already exists',
          HttpStatus.CONFLICT,
        );
      } else if (e.code === 'P2000') {
        throw new HttpException(
          'Name or slug is too long',
          HttpStatus.BAD_REQUEST,
        );
      }

      throw new HttpException('Something went wrong', HttpStatus.BAD_REQUEST);
    }
  }
}
