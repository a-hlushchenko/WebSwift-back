import { IsNumber, IsString } from 'class-validator';

export class CreateAdminDto {
  @IsString()
  login: string;

  @IsString()
  password: string;
}

export type TCreateAdminDto = Partial<CreateAdminDto>;
