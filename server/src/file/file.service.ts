import { Injectable, Inject } from '@nestjs/common';
import { ModelClass } from 'objection';
import { FileModel } from '../database/models/file.model';
import FileStoreDto from './dto/fileStore.dto';
import { s3, bucketName } from './s3';

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

  async storeFilename(data: FileStoreDto): Promise<FileModel> {
    return await this.fileModel
      .query()
      .insert(data)
      .returning('*')
      .first();
  }

  async removeFilename(filename: string): Promise<FileModel> {
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
      s3.deleteObject({ Bucket: bucketName, Key: filename }).promise();
    });
  }
}
