import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { PageDto } from './dto/page.dto';

@Injectable()
export class ContentService {
  constructor(private readonly prisma: PrismaService) {}

  async getContent(language: 'en' | 'ua') {
    try {
      const fieldKey = `value_${language}`;

      const [pages, posts] = await Promise.all([
        this.prisma.pages.findMany({
          include: {
            sections: {
              include: {
                fields: {
                  select: {
                    slug: true,
                    type: true,
                    file_url: true,
                    [fieldKey]: true,
                  },
                },
              },
            },
          },
        }),
        this.prisma.posts.findMany({
          include: {
            fields: {
              select: {
                slug: true,
                type: true,
                file_url: true,
                [fieldKey]: true,
              },
            },
          },
        }),
      ]);

      const baseUrl =
        process.env.BACKEND_URL || `http://localhost:${process.env.PORT}`;

      const formattedPages = pages.reduce((acc, page) => {
        acc[page.slug] = {};
        page.sections.forEach((section) => {
          acc[page.slug][section.slug] = {};
          section.fields.forEach((field) => {
            acc[page.slug][section.slug][field.slug] =
              field.type === 'text'
                ? field[fieldKey]
                : `${baseUrl}${field.file_url}`;
          });
        });
        return acc;
      }, {});

      const formattedPosts = posts.reduce((acc, post) => {
        const category = post.category;
        if (!acc[category]) acc[category] = [];
        acc[category].push(
          post.fields.reduce<Record<string, string>>((fieldsAcc, field) => {
            fieldsAcc[field.slug] =
              field.type === 'text'
                ? field[fieldKey]
                : `${baseUrl}${field.file_url}`;
            return fieldsAcc;
          }, {}),
        );
        return acc;
      }, {});

      return {
        ...formattedPages,
        posts: formattedPosts,
      };
    } catch (error) {
      console.error('Error fetching pages and posts:', error);
      throw new HttpException('Something went wrong', HttpStatus.BAD_REQUEST);
    }
  }
}
