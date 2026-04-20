import { AuthGuard } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';

import { JWTMessages } from '../auth.constants';

export interface AuthenticatedUser {
  userId: number;
  nickname: string;
  email: string;
}

export interface RequestWithUser extends Request {
  user: AuthenticatedUser;
}

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  handleRequest<TUser = AuthenticatedUser>(err: any, user: TUser): TUser {
    if (err || !user)
      throw err || new UnauthorizedException(JWTMessages.Errors.Unauthorized);

    return user;
  }
}
