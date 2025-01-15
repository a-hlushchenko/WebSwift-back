import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { AppController } from './app.controller';
import { AdminsModule } from './admins/admins.module';
import { ContentModule } from './content/content.module';
import { PagesModule } from './pages/pages.module';
import { SectionsModule } from './sections/sections.module';
import { FieldsModule } from './fields/fields.module';
import { FeedbackModule } from './feedback/feedback.module';
import { TelegramModule } from './telegram/telegram.module';

@Module({
  imports: [
    AuthModule,
    AdminsModule,
    ContentModule,
    PagesModule,
    SectionsModule,
    FieldsModule,
    FeedbackModule,
    TelegramModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
