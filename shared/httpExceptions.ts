import { HttpException, HttpStatus } from '@nestjs/common';

export class ForbiddenException extends HttpException {
  constructor(error: string) {
    super({ statusCode: HttpStatus.FORBIDDEN, error }, HttpStatus.FORBIDDEN);
  }
}

export class NotAcceptableException extends HttpException {
  constructor(error: string) {
    super(
      { statusCode: HttpStatus.NOT_ACCEPTABLE, error },
      HttpStatus.NOT_ACCEPTABLE,
    );
  }
}

export class NotFoundException extends HttpException {
  constructor(error: string) {
    super(
      { statusCode: HttpStatus.NOT_FOUND, error },
      HttpStatus.NOT_FOUND,
    );
  }
}