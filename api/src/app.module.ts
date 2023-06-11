import { Module } from '@nestjs/common';
import { StoryboardController } from './storyboard.controller.js';
@Module({
  imports: [],
  controllers: [StoryboardController],
  providers: [],
})
export class AppModule {}
