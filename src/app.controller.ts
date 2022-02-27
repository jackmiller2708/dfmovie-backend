import { Controller, Get, Post, UseGuards, Req } from '@nestjs/common';
import { LocalAuthGuard } from './auth/guards/local-auth.guard';
import { AuthService } from './auth/auth.service';
import { Request } from 'express';
import { Public } from 'shared/decorators/PublicRoute.decorator';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly authService: AuthService, private readonly appService: AppService) {}

  @Post('auth/login')
  @Public()
  @UseGuards(LocalAuthGuard)
  async login(@Req() { user }: Request) {
    return this.authService.login(user);
  }

  @Get('auth/permissions')
  @Public()
  getPermissions(): any[] {
    return this.appService.getPermissions();
  }
}
