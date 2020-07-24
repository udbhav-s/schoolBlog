import { Injectable, Inject } from '@nestjs/common';
import { ModelClass } from 'objection';
import { FileModel } from '../database/models/file.model';
import FileStoreDto from './dto/fileStore.dto';
import { s3, bucketName } from './s3';
import * as fs from 'fs';
import * as path from 'path';
import * as sharp from "sharp";

@Injectable()
export class FileService {
  constructor(
    @Inject('FileModel') private fileModel: ModelClass<FileModel>,
  ) {}

  async getByFilename(filename: string): Promise<FileModel> {
    return await this.fileModel
      .query()
      .where({ filename })
      .first()
      .withGraphFetched('[post]');
  }

  async getByPost(postId: number, thumbnail?: boolean): Promise<FileModel[]> {
    const options: Partial<FileStoreDto> = { postId };
    if (thumbnail) options.type = "thumbnail";
    return await this.fileModel.query().where(options);
  }

  async storeFilenameDB(data: FileStoreDto): Promise<FileModel> {
    return await this.fileModel
      .query()
      .insert(data)
      .returning('*')
      .first();
  }

  async removeFilenameDB(filename: string): Promise<FileModel> {
    return await this.fileModel
      .query()
      .where({ filename })
      .del()
      .returning('*')
      .first();
  }

  // delete files associated with a post
  async removePostFiles(postId: number): Promise<void> {
    // delete files from database
    const rows = await this.fileModel
      .query()
      .where({ postId })
      .del()
      .returning('*');
    // delete files from folder
    rows.forEach(row => {
      const { filename } = row;
      // delete the file from the folder
      this.deleteFile(filename);
    });
  }

  async storeFile(filename: string, file: Buffer) {
    if (process.env.STORAGE === 's3') {
      return await s3.putObject({
        Bucket: bucketName,
        Key: filename,
        Body: file
      }).promise();
    } else if (process.env.STORAGE === 'local') {
      return fs.writeFileSync(path.join(process.env.UPLOADS_PATH, filename), file); 
    }
  }

  async deleteFile(filename: string) {
    if (process.env.STORAGE === 's3') {
      return await s3.deleteObject({ Bucket: bucketName, Key: filename }).promise();
    } else if (process.env.STORAGE === 'local') {
      return fs.unlinkSync(path.join(process.env.UPLOADS_PATH, filename)); 
    }
  }

  async imageToJpeg(file: Buffer) {
    return await sharp(file)
      .flatten({ background: '#ffffff' })
      .toFormat('jpeg')
      .toBuffer();
  }
}
