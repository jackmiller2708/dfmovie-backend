import { SetMetadata } from '@nestjs/common';
import { Permissions } from 'src/auth/auth.permission';

export const PERMISSION_KEY = 'permissions';
export const Authorize = (...permissions: Permissions[]) =>
  SetMetadata(PERMISSION_KEY, permissions);
