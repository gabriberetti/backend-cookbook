import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  ListObjectsV2Command,
  DeleteObjectCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { config } from '../config';

const s3 = new S3Client({
  region: config.aws.region,
  credentials: {
    accessKeyId: config.aws.accessKeyId,
    secretAccessKey: config.aws.secretAccessKey,
  },
});

export interface UploadResult {
  key: string;
  url: string;
  bucket: string;
  size: number;
  contentType: string;
}

export interface S3Object {
  key: string;
  size: number;
  lastModified: Date;
}

export const s3Service = {
  async upload(
    key: string,
    body: Buffer,
    contentType: string
  ): Promise<UploadResult> {
    await s3.send(
      new PutObjectCommand({
        Bucket: config.aws.s3Bucket,
        Key: key,
        Body: body,
        ContentType: contentType,
      })
    );

    return {
      key,
      url: `https://${config.aws.s3Bucket}.s3.${config.aws.region}.amazonaws.com/${key}`,
      bucket: config.aws.s3Bucket,
      size: body.length,
      contentType,
    };
  },

  async getPresignedUrl(key: string, expiresInSeconds = 3600): Promise<string> {
    const command = new GetObjectCommand({
      Bucket: config.aws.s3Bucket,
      Key: key,
    });
    return getSignedUrl(s3, command, { expiresIn: expiresInSeconds });
  },

  async list(prefix?: string): Promise<S3Object[]> {
    const response = await s3.send(
      new ListObjectsV2Command({
        Bucket: config.aws.s3Bucket,
        Prefix: prefix,
      })
    );

    return (response.Contents ?? []).map((obj) => ({
      key: obj.Key ?? '',
      size: obj.Size ?? 0,
      lastModified: obj.LastModified ?? new Date(),
    }));
  },

  async delete(key: string): Promise<void> {
    await s3.send(
      new DeleteObjectCommand({
        Bucket: config.aws.s3Bucket,
        Key: key,
      })
    );
  },
};
