import { IsString, IsOptional, IsNumber, IsIn } from 'class-validator';

export class FieldUpdateDto {
  @IsNumber()
  id: number;

  @IsString()
  @IsIn(['text', 'file'])
  type: 'text' | 'file';

  @IsOptional()
  @IsString()
  value?: string;

  @IsOptional()
  file?: Express.Multer.File;
}

export class UpdateFieldsDto {
  fields: FieldUpdateDto[];

  @IsString()
  lang: string;
}

export type TUpdateFieldsDTO = Partial<UpdateFieldsDto>;
