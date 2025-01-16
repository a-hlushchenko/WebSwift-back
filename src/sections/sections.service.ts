import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { SectionDto } from './dto/section.dto';

@Injectable()
export class SectionsService {
  constructor(private readonly prisma: PrismaService) {}

  async getSections(pageId: number, lang: string) {
    try {
      const page = await this.prisma.pages.findUnique({
        where: {
          id: pageId,
        },
        include: {
          sections: {
            include: {
              fields: true,
            },
            orderBy: {
              id: 'asc',
            },
          },
        },
      });

      const baseUrl =
        process.env.BACKEND_URL || `http://localhost:${process.env.PORT}`;

      page.sections.forEach((section) => {
        section.fields.forEach((field) => {
          if (field.file_url) {
            field.file_url = `${baseUrl}${field.file_url}`;
          }
        });
      });

      return page;
    } catch (e) {
      throw new HttpException('Something went wrong', HttpStatus.BAD_REQUEST);
    }
  }

  async addSection(addSectionDTO: SectionDto) {
    try {
      const section = await this.prisma.sections.create({
        data: addSectionDTO,
      });
      return section;
    } catch (e) {
      if (e.code === 'P2002' && e.meta?.target?.includes('slug')) {
        throw new HttpException(
          'Section with this slug already exists',
          HttpStatus.CONFLICT,
        );
      } else if (e.code === 'P2000') {
        throw new HttpException(
          'Name or slug is too long',
          HttpStatus.BAD_REQUEST,
        );
      }

      console.log(e);

      throw new HttpException('Something went wrong', HttpStatus.BAD_REQUEST);
    }
  }

  async delSection(sectionId: number) {
    try {
      const section = await this.prisma.sections.delete({
        where: {
          id: sectionId,
        },
      });

      return {
        message: 'Section deleted successfully',
        section,
      };
    } catch (e) {
      throw new HttpException('Something went wrong', HttpStatus.BAD_REQUEST);
    }
  }

  async editSection(sectionId: number, sectionDTO: SectionDto) {
    try {
      const section = await this.prisma.sections.update({
        where: {
          id: sectionId,
        },
        data: sectionDTO,
      });
      return section;
    } catch (e) {
      if (e.code === 'P2002' && e.meta?.target?.includes('slug')) {
        throw new HttpException(
          'Section with this slug already exists',
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
