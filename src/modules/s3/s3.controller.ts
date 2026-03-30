import { Controller, Post, Get, Body, Query, Res } from '@nestjs/common';
import { S3Service } from './s3.service';
import type { Response } from 'express';

@Controller('s3')
export class S3Controller {
  constructor(private readonly s3Service: S3Service) {}

  @Post('upload')
  upload(@Body() body: { filename: string; content: string }) {
    return this.s3Service.upload(body.filename, body.content);
  }

  @Get('files')
  list() {
    return this.s3Service.list();
  }

  @Get('download')
  async download(@Query('key') key: string, @Res() res: Response) {
    const file = await this.s3Service.download(key);
    res.send(file);
  }
}
