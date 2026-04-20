import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/core';
import * as bcrypt from 'bcrypt';

import { User } from '../entities/user/user.entity';
import { LoginDto } from '../dto/auth.dto';
import { LoginMessages } from '../auth.constants';

@Injectable()
export class LoginService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: EntityRepository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto) {
    const user = await this.validateUser(loginDto.email, loginDto.password);
    if (!user)
      throw new UnauthorizedException(LoginMessages.Errors.InvalidCredentials);

    return this.generateToken(user);
  }

  async validateUser(email: string, pass: string) {
    const user = await this.userRepository.findOne({ email });
    if (user && (await bcrypt.compare(pass, user.password))) {
      const { password, ...result } = user;
      return result as Omit<User, 'password'>;
    }
    return null;
  }

  generateToken(user: Omit<User, 'password'>) {
    const payload = { email: user.email, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
