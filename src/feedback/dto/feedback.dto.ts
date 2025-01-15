import { IsString } from 'class-validator';

export class FeedbackDto {
  @IsString()
  contact: string;

  message?: string;

  @IsString()
  lang: string;

  @IsString()
  section: string;
}

export type TFeedbackTO = Partial<FeedbackDto>;
