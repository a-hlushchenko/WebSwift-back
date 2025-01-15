import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { FieldDto } from './dto/field.dto';
import { UpdateFieldsDto } from './dto/update-fields.dto';
import * as path from 'path';
import * as fs from 'fs';

@Injectable()
export class FieldsService {
  constructor(private readonly prisma: PrismaService) {}

  async addField(addFieldDTO: FieldDto) {
    try {
      const section = await this.prisma.fields.create({
        data: addFieldDTO,
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

  async delField(fieldId: number) {
    try {
      const field = await this.prisma.fields.delete({
        where: {
          id: fieldId,
        },
      });

      return {
        message: 'Field deleted successfully',
        field,
      };
    } catch (e) {
      throw new HttpException('Something went wrong', HttpStatus.BAD_REQUEST);
    }
  }

  async editField(fieldId: number, fieldDTO: FieldDto) {
    try {
      const field = await this.prisma.fields.update({
        where: {
          id: fieldId,
        },
        data: fieldDTO,
      });
      return field;
    } catch (e) {
      if (e.code === 'P2002' && e.meta?.target?.includes('slug')) {
        throw new HttpException(
          'Field with this slug already exists',
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

  async updateFields(
    updateFieldsDto: UpdateFieldsDto,
    files: Express.Multer.File[] = [],
  ) {
    const { fields, lang } = updateFieldsDto;

    try {
      const operations = fields
        .map((field) => {
          if (field.type === 'text') {
            return this.prisma.fields.update({
              where: { id: Number(field.id) },
              data: { [`value_${lang}`]: field.value },
            });
          }

          if (field.type === 'file') {
            const baseFilename = `field_${field.id}`;

            const file = files.find((f) => f.fieldname === baseFilename);
            if (file) {
              const uploadDir = path.join(__dirname, '..', '..', 'uploads');

              const matchingFiles = fs
                .readdirSync(uploadDir)
                .filter((filename) => filename.startsWith(baseFilename));

              if (matchingFiles.length > 1) {
                const filesWithStats = matchingFiles.map((filename) => {
                  const filePath = path.join(uploadDir, filename);
                  const stats = fs.statSync(filePath);
                  return { filename, mtime: stats.mtime, filePath };
                });

                filesWithStats.sort(
                  (a, b) => a.mtime.getTime() - b.mtime.getTime(),
                );

                filesWithStats.slice(0, -1).forEach((fileToDelete) => {
                  fs.unlinkSync(fileToDelete.filePath);
                });
              }

              const fileUrl = `/uploads/${file.filename}`;
              return this.prisma.fields.update({
                where: { id: Number(field.id) },
                data: { file_url: fileUrl },
              });
            }

            return null;
          }

          return null;
        })
        .filter((operation) => operation !== null);

      if (operations.length > 0) {
        await this.prisma.$transaction(operations);
      }

      return { message: 'Fields updated successfully' };
    } catch (error) {
      console.error('Error updating fields:', error);
      throw new HttpException(
        'Failed to update fields',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async deleteFile(filePath: string): Promise<void> {
    const absolutePath = path.resolve(__dirname, '../../..', filePath);

    try {
      if (fs.existsSync(absolutePath)) {
        fs.unlinkSync(absolutePath);
      }
    } catch (error) {
      console.error(`Failed to delete file at ${filePath}:`, error);
    }
  }
}
