import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { TransformInterceptor } from 'shared/transform.interceptor';
import { HttpExceptionFilter } from 'shared/execption.filter';
import { PermissionsGuard } from './auth/guards/permission.guard';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { ConfigModule } from '@nestjs/config';
import { MovieModule } from './movie/movie.module';
import { AdminModule } from './admin/admin.module';
import { AuthModule } from './auth/auth.module';
import { AppService } from './app.service';
import { Module } from '@nestjs/common';

import configuration from 'config/configuration';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: 'config/.development.env',
      load: [configuration],
    }),
    MongooseModule.forRootAsync({
      useFactory: () => ({ uri: process.env.DBSTRING }),
    }),
    AdminModule,
    MovieModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [
    { provide: APP_INTERCEPTOR, useClass: TransformInterceptor },
    { provide: APP_FILTER, useClass: HttpExceptionFilter },
    { provide: APP_GUARD, useClass: JwtAuthGuard },
    { provide: APP_GUARD, useClass: PermissionsGuard },
    AppService,
  ],
})
export class AppModule {
  constructor() {}
}
