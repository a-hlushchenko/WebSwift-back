import { Body, Controller, Post } from '@nestjs/common';
import { FeedbackService } from './feedback.service';
import { FeedbackDto } from './dto/feedback.dto';

@Controller('feedback')
export class FeedbackController {
  constructor(private readonly feedbackService: FeedbackService) {}

  @Post('')
  feedback(@Body() feedbackDTO: FeedbackDto) {
    return this.feedbackService.feedback(feedbackDTO);
  }
}
