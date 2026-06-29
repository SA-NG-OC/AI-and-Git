import { GoogleGenAI, Type } from "@google/genai";
import { Injectable, OnModuleInit } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class AiService implements OnModuleInit {
  private ai!: GoogleGenAI;

  constructor(private configService: ConfigService) { };

  onModuleInit() {
    const apiKey = this.configService.get<string>('GEMINI_API_KEY');
    this.ai = new GoogleGenAI({ apiKey });

    if (!apiKey) {
      throw new Error('Không tìm thấy GEMINI_API_KEY trong file .env rồi bạn ơi!');
    }
  }

  async generateText(prompt: string): Promise<string> {
    const response = await this.ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return response.text as string;
  }

  async extractSkillsFromCV(cvText: string) {
    const response = await this.ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Hãy phân tích đoạn văn bản CV sau và trích xuất thông tin: ${cvText}`,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            fullName: { type: Type.STRING },
            skills: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: 'Danh sách các kỹ năng lập trình hoặc công nghệ.',
            },
            yearsOfExperience: { type: Type.INTEGER },
          },
          required: ['fullName', 'skills'],
        },
      },
    });

    return JSON.parse(response.text as string);
  }
}