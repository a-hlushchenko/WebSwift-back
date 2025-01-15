import { IsString, Matches } from 'class-validator';

export class PageDto {
  @IsString()
  name: string;

  @IsString()
  @Matches(/^[a-zA-Z0-9_-]+$/, {
    message: 'Slug can only contain a-z, 0-9, -, _',
  })
  slug: string;
}

export type TPageDTO = Partial<PageDto>;
