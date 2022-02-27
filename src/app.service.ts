import { Injectable } from '@nestjs/common';
import { createReadStream, ReadStream } from 'fs';
import { join } from 'path';
import { existsSync, unlink } from 'fs';
import { NotFoundException } from 'shared/httpExceptions';
import { Permissions } from './auth/auth.permission';
import { singular } from 'pluralize';

@Injectable()
export class AppService {
  getPermissions(): any[] {
    const splitPermission = Object.values(Permissions).map((permission) => permission.split('.'));
    const root = Array.from(new Set(splitPermission.map(([root]) => root)));
    const features = Array.from(new Set(splitPermission.map(([, feature]) => feature)));

    const permissionTree = root.map((permission) => {
      const children = features.map((feature) => {
        const fChildren = splitPermission
          .filter(([, spFeature]) => spFeature === feature)
          .map((operation) => {
            return { name: operation.join('.'), displayName: `${operation[2]} ${singular(feature)}` };
          });

        return { name: [root, feature].join('.'), displayName: feature, children: fChildren };
      });

      return { name: permission, displayName: permission, children };
    });

    return permissionTree;
  }

  getUploadedImage(filename: string): ReadStream {
    const filePath = join(process.cwd(), 'uploads', 'poster', filename);

    if (!existsSync(filePath)) {
      throw new NotFoundException('Image Not Found!');
    }

    return createReadStream(filePath);
  }

  removeUploadImage(filename: string): void {
    const filePath = join(process.cwd(), 'uploads', 'poster', filename);

    unlink(filePath, (err) => {
      if (err) return console.log(err);
      console.log('file deleted successfully');
    });
  }
}
