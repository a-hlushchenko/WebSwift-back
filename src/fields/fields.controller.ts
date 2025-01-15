import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
  UploadedFile,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { FieldsService } from './fields.service';
import { Roles } from 'src/auth/roles.decorator';
import { FieldDto } from './dto/field.dto';
import { UpdateFieldsDto } from './dto/update-fields.dto';
import {
  AnyFilesInterceptor,
  FileInterceptor,
  FilesInterceptor,
} from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';

@Controller('field')
export class FieldsController {
  constructor(private readonly fieldsService: FieldsService) {}

  @UsePipes(new ValidationPipe())
  @UseGuards(AuthGuard)
  @Roles('dev', 'owner')
  @Post('add')
  addPage(@Body() fieldDTO: FieldDto) {
    return this.fieldsService.addField(fieldDTO);
  }

  @UseGuards(AuthGuard)
  @Roles('dev', 'owner')
  @Delete('del/:fieldId')
  delPage(@Param('fieldId') fieldId: string) {
    return this.fieldsService.delField(Number(fieldId));
  }

  @UsePipes(new ValidationPipe())
  @UseGuards(AuthGuard)
  @Roles('dev', 'owner')
  @Put('edit/:fieldId')
  editPage(@Param('fieldId') fieldId: string, @Body() fieldDTO: FieldDto) {
    return this.fieldsService.editField(Number(fieldId), fieldDTO);
  }

  @UsePipes(new ValidationPipe())
  @UseGuards(AuthGuard)
  @Roles('dev', 'owner', 'editor')
  @Put('update-all')
  @UseInterceptors(
    AnyFilesInterceptor({
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const ext = path.extname(file.originalname);
          const filename = `${file.fieldname}${ext}`;
          cb(null, filename);
        },
      }),
      fileFilter: (req, file, cb) => {
        const allowedTypes = ['image/jpeg', 'image/png', 'image/svg+xml'];
        if (!allowedTypes.includes(file.mimetype)) {
          return cb(new Error('Unsupported file type'), false);
        }
        cb(null, true);
      },
      limits: {
        fileSize: 5 * 1024 * 1024, // Максимум 5 MB
      },
    }),
  )
  updateFields(
    @Body() updateFieldsDTO: UpdateFieldsDto,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    return this.fieldsService.updateFields(updateFieldsDTO, files);
  }

  @Post('upload-test')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const filename = file.fieldname;
          console.log('filename', filename);
          cb(null, filename);
        },
      }),
    }),
  )
  async uploadTest(@UploadedFile() file: Express.Multer.File) {
    console.log('Uploaded file:', file);
    return { message: 'File uploaded successfully', file };
  }
}
