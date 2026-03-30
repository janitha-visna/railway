import { Injectable } from '@nestjs/common';
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  ListObjectsV2Command,
} from '@aws-sdk/client-s3';
import { Readable } from 'stream';

@Injectable()
export class S3Service {
  private s3 = new S3Client({
    region: process.env.S3_REGION,
    endpoint: process.env.S3_ENDPOINT,
    credentials: {
      accessKeyId: process.env.S3_ACCESS_KEY as string,
      secretAccessKey: process.env.S3_SECRET_KEY as string,
    },
    forcePathStyle: true,
  });

  async upload(key: string, body: string) {
    try {
      return await this.s3.send(
        new PutObjectCommand({
          Bucket: process.env.S3_BUCKET,
          Key: key,
          Body: body,
        }),
      );
    } catch (err) {
      console.error('S3 Upload Error:', err);
      throw err; // or throw new InternalServerErrorException('Upload failed');
    }
  }

  async list() {
    const res = await this.s3.send(
      new ListObjectsV2Command({
        Bucket: process.env.S3_BUCKET,
      }),
    );
    return res.Contents;
  }

  async download(key: string): Promise<Buffer> {
    const res = await this.s3.send(
      new GetObjectCommand({
        Bucket: process.env.S3_BUCKET,
        Key: key,
      }),
    );

    const stream = res.Body as Readable;
    const chunks: Uint8Array[] = [];

    for await (const chunk of stream) {
      chunks.push(chunk);
    }

    return Buffer.concat(chunks);
  }
}
