export class LoginAuthDto {
  login: string;
  password: string;
}

export type TLoginAuthDTO = Partial<LoginAuthDto>;
