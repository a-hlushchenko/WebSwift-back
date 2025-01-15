import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { FeedbackDto } from './dto/feedback.dto';
import { TelegramService } from 'src/telegram/telegram.service';

@Injectable()
export class FeedbackService {
  constructor(private readonly tg: TelegramService) {}

  async feedback(feedbackDTO: FeedbackDto) {
    const { contact, message, lang, section } = feedbackDTO;
    const tgMessage = `Contact: ${contact}${
      message
        ? `
Message: ${message}`
        : ''
    }
    
Lang: ${lang}
Section: ${section}`;
    const res = await this.tg.sendMessage(tgMessage);

    if (res) {
      return true;
    } else {
      throw new HttpException('Something went wrong', HttpStatus.BAD_REQUEST);
    }
  }
}
