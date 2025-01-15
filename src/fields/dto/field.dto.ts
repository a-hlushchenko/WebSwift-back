import { FieldType } from '@prisma/client';
import { IsString, Matches } from 'class-validator';

export class FieldDto {
  @IsString()
  name: string;

  @IsString()
  @Matches(/^[a-zA-Z0-9_-]+$/, {
    message: 'Slug can only contain a-z, 0-9, -, _',
  })
  slug: string;

  page_id: number;

  type: FieldType;

  section_id: number;
}

export type TFieldDTO = Partial<FieldDto>;
