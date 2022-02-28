import { UserRole, UserRoleSchema } from 'shared/models/userrole.shema';
import { Role, RoleSchema } from './roles/models/roles.schema';
import { User, UserSchema } from './users/models/user.schema';
import { UsersController } from './users/users.controller';
import { RolesController } from './roles/roles.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { MulterModule } from '@nestjs/platform-express';
import { UsersService } from './users/users.service';
import { RolesService } from './roles/roles.service';
import { diskStorage } from 'multer';
import { Module } from '@nestjs/common';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: UserRole.name, schema: UserRoleSchema },
      { name: Role.name, schema: RoleSchema }
    ]),
    MulterModule.register({
      storage: diskStorage({
        destination: 'uploads/PFPs',
        filename: function (req, file, cb) {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);

          cb(null, file.originalname + '-' + uniqueSuffix);
        },
      }),
    }),
  ],
  controllers: [UsersController, RolesController],
  providers: [UsersService, RolesService],
  exports: [UsersService]
})
export class AdminModule {}
