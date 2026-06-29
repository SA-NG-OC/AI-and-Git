// src/ai.controller.ts
import { Controller, Post, Body } from '@nestjs/common';
import { AiService } from './ai.service';

@Controller('ai')
export class AiController {
  constructor(private readonly aiService: AiService) { }

  @Post('simple-text')
  async simpleText(@Body('prompt') prompt: string) {
    const result = await this.aiService.generateText(prompt);
    return { success: true, data: result };
  }

  @Post('parse-cv')
  async parseCv(@Body('cvText') cvText: string) {
    const data = await this.aiService.extractSkillsFromCV(cvText);
    return { success: true, data };
  }
}