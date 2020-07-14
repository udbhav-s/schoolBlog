import * as aws from 'aws-sdk';

export const s3 = new aws.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});

export const bucketName = process.env.S3_BUCKET_NAME;