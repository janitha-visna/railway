import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  @Get()
  getHello(): string {
    return 'Hello World! 👋 NestJS is running successfully on Railway!';
  }

  @Get('health')
  healthCheck(): object {
    return {
      status: 'ok',
      message: 'Application is healthy',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development',
      port: process.env.PORT || 3000,
    };
  }
}
