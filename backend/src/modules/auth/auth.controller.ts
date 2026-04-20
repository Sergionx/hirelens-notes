import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiConflictResponse } from '@nestjs/swagger';
import { ZodResponse } from 'nestjs-zod';
import { Throttle } from '@nestjs/throttler';

import { LoginService } from './services/login.service';
import { RegisterService } from './services/register.service';
import { LoginMessages, RegisterMessages } from './auth.constants';

import { LoginDto, RegisterDto } from './dto/auth.dto';
import { User_MessageDto } from './dto/user-response.dto';
import { AcessToken_MessageDto } from './dto/login-response.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly loginService: LoginService,
    private readonly registerService: RegisterService,
  ) {}
  @Throttle({ default: { ttl: 3000, limit: 100 } })
  @Post('login')
  @ApiOperation({ summary: 'Login user' })
  @ZodResponse({
    description: LoginMessages.Success,
    type: AcessToken_MessageDto,
  })
  @ApiConflictResponse({ description: LoginMessages.Errors.InvalidCredentials })
  async login(@Body() loginDto: LoginDto) {
    const token = await this.loginService.login(loginDto);
    return {
      message: LoginMessages.Success,
      data: token,
    };
  }

  @Throttle({ default: { ttl: 3000, limit: 100 } })
  @Post('register')
  @ApiOperation({ summary: 'Register user' })
  @ZodResponse({
    description: RegisterMessages.Success,
    type: User_MessageDto,
  })
  @ApiConflictResponse({ description: RegisterMessages.Errors.EmailInUse })
  async register(@Body() registerDto: RegisterDto) {
    const user = await this.registerService.register(registerDto);
    return {
      message: RegisterMessages.Success,
      data: user,
    };
  }
}
