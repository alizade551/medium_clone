import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Response } from 'express';
import { ExpressRequest } from 'src/types/expressRequest.interface';
import { verify } from 'jsonwebtoken';
import { JWT_SECRET } from 'src/config';
import { UserService } from '../user.service';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private readonly userService: UserService) {}

  async use(req: ExpressRequest, _: Response, next: NextFunction) {
    if (!req.headers.authorization) {
      req.user = null;
    }

    try {
      const token = req.headers.authorization.split(' ')[1];
      const decode = await verify(token, JWT_SECRET);
      const user = await this.userService.findById(decode.id);
      req.user = user;
    } catch (error) {
      req.user = null;
    }
    next();
  }
}
