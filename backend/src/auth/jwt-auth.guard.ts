import { Injectable,  UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';


export interface AuthenticatedUser {
  userId: number;
  username: string;
  email: string;
}

export interface RequestWithUser extends Request {
  user: AuthenticatedUser;
}

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {


   handleRequest<TUser = AuthenticatedUser>(err: any, user: TUser): TUser {
    if (err || !user)
      throw err || new UnauthorizedException(AuthMessages.Errors.Unauthorized);

    return user;
  }
}