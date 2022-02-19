import { Injectable } from '@nestjs/common';
import { createReadStream, ReadStream } from 'fs';
import { join } from 'path';
import { existsSync, unlink } from 'fs';
import { NotFoundException } from 'shared/httpExceptions';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }

  getUploadedImage(filename: string): ReadStream {
    const filePath = join(process.cwd(), 'uploads', filename);

    if (!existsSync(filePath)) {
      throw new NotFoundException('Image Not Found!');
    }

    return createReadStream(filePath);
  }

  removeUploadImage(filename: string): void {
    const filePath = join(process.cwd(), 'uploads', filename);

    unlink(filePath, (err) => {
      if (err) return console.log(err);
      console.log('file deleted successfully');
    });
  }
}
