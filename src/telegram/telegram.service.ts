import { Injectable } from '@nestjs/common';
import * as TelegramBot from 'node-telegram-bot-api';

@Injectable()
export class TelegramService {
  private bot: TelegramBot;

  constructor() {
    const token = process.env.BOT_TOKEN;
    this.bot = new TelegramBot(token, { polling: false });
  }

  async sendMessage(message: string) {
    try {
      await this.bot.sendMessage(process.env.CHAT_ID, message);
      return true;
    } catch (error) {
      return false;
    }
  }
}
