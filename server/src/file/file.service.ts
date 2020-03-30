import {
  Injectable,
  Inject,
  BadRequestException,
} from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { JSDOM } from 'jsdom';
import { ModelClass } from 'objection';
import { ConfigService } from '@nestjs/config';
import { FileModel } from '../database/models/file.model';

@Injectable()
export class FileService {
  constructor(
    private configService: ConfigService,
    @Inject('FileModel') private fileModel: ModelClass<FileModel>,
  ) {}

  private validImageTypes = [
    'png',
    'jpeg',
    'jpg',
    'gif',
    'bmp',
    'ico',
    'jfif',
    'pjpeg',
  ];

  async getByFilename(filename: string): Promise<FileModel> {
    return await this.fileModel
      .query()
      .where({ filename })
      .first()
      .withGraphFetched('[post]');
  }

  async getByPost(postId: number): Promise<FileModel[]> {
    return await this.fileModel.query().where({ postId });
  }

  getImageTypeFromData(data: string): string {
    // extract the image type - format is data:image/jpeg|png|etc;base64
    const position = data.search('data:image/') + 'data:image/'.length;
    const type = data.substring(position, data.search(';'));
    // if the type is not an image throw an error
    if (
      data.search('data:image/') === -1 ||
      !this.validImageTypes.includes(type)
    ) {
      throw new BadRequestException(`Non-image file found in data`);
    }
    return type;
  }

  // returns html with replaced src attribiutes
  // & list of filenames of successfully stored images
  separateAndStoreImages(html: string): { html: string; filenames: string[] } {
    // parse html and create a document
    const { document } = new JSDOM(html).window;

    // get all images from the document
    const images = document.getElementsByTagName('img');
    const filenames = [];

    // get the path to store images in
    const imagesPath = this.configService.get<string>('IMAGES_PATH');

    // loop through all images
    try {
      Array.from(images).forEach(elem => {
        // extract the src data
        if (!elem.src)
          throw new BadRequestException('Image without source received');
        const data = elem.src;

        const type = this.getImageTypeFromData(data);

        // extract the actual image data
        const imageData = data.replace(/^data:([A-Za-z-+/]+);base64,/, '');
        // create the filename for the image to be stored
        const filename = `${Date.now()}.${type}`;

        // write the file to the folder - will throw error if unsuccessful
        fs.writeFileSync(path.join(imagesPath, filename), imageData, {
          encoding: 'base64',
        });
        // add filename to list of successfully added files
        filenames.push(filename);
        // replace source attribute with uploaded filename
        elem.setAttribute('src', `/api/file/image/${filename}`);
      });

      // return the names of uploaded files
      return {
        html: document.body.innerHTML,
        filenames,
      };
    } catch (err) {
      // if there is an error uploading files delete all the uploaded ones
      filenames.forEach(filename => {
        fs.unlinkSync(path.join(imagesPath, filename));
      });
      throw err;
    }
  }

  imagePathToBase64(location: string, filename: string): string {
    // get file type
    const type = filename.substring(filename.indexOf('.') + 1);
    // read data
    const data = fs.readFileSync(path.join(location, filename), {
      encoding: 'base64',
    });
    // return in form of data uri
    return `data:image/${type};base64,${data}`;
  }

  // turns files back into base64 image URIs for editing mode
  // (since all old images are deleted when updating a post)
  // any old images will be added again as new ones from the data URIs
  joinImages(filenames: string[], html: string): string {
    // parse html and create a document
    const { document } = new JSDOM(html).window;
    // get images path
    const imagesPath = this.configService.get<string>('IMAGES_PATH');
    // get all images from the document
    const images = document.getElementsByTagName('img');

    Array.from(images).forEach(image => {
      // get source path
      const src = image.src;
      // check if image is local and extract filename
      const result = src.match(/[\/]?api\/file\/image\/(.*)[\/]?/);
      if (result) {
        // extracted filename
        let filename = result[1];
        if (filename.endsWith('/'))
          filename = filename.substring(0, filename.length - 1);

        // file should belong to the post in db
        if (filenames.includes(filename)) {
          // get base64 data from file
          const data = this.imagePathToBase64(imagesPath, filename);
          // set the source of the image to the data
          image.setAttribute('src', data);
        }
      }
    });

    // return the html with the reset images
    return document.body.innerHTML;
  }

  // delete files associated with a post
  async removePostFiles(postId: number): Promise<void> {
    const imagesPath = this.configService.get<string>('IMAGES_PATH');
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
      const imagePath = path.join(imagesPath, filename);
      fs.unlinkSync(imagePath);
    });
  }

  // get thumbnail in base64 (for post edit mode)
  async getBase64Thumbnail(filename: string): Promise<string> {
    const thumbnailsPath = this.configService.get<string>('THUMBNAILS_PATH');
    return this.imagePathToBase64(thumbnailsPath, filename);
  }

  // upload thumbnail image
  uploadThumbnail(data: string): string {
    // get type
    const type = this.getImageTypeFromData(data);
    // get image data
    const imageData = data.replace(/^data:([A-Za-z-+/]+);base64,/, '');
    // create the path for the thumbnail to be stored
    const filename = `thumbnail-${Date.now()}.${type}`;
    // get the path to store thumbnails
    const thumbnailsPath = this.configService.get<string>('THUMBNAILS_PATH');
    // write the file to the folder - will throw error if unsuccessful
    fs.writeFileSync(path.join(thumbnailsPath, filename), imageData, {
      encoding: 'base64',
    });
    // return the thumbnail filename
    return filename;
  }

  // remove thumbnail image
  // does not delete from DB since only the filename needs to be changed
  removeThumbnail(filename: string): void {
    const thumbnailsPath = this.configService.get<string>('THUMBNAILS_PATH');
    fs.unlinkSync(path.join(thumbnailsPath, filename));
  }
}
