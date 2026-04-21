import { Controller, Post, Body, UseGuards, Get } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiConflictResponse,
  ApiBearerAuth,
  ApiNotFoundResponse,
} from '@nestjs/swagger';
import { ZodResponse } from 'nestjs-zod';
import { Throttle } from '@nestjs/throttler';

import { LoginService } from './services/login.service';
import { RegisterService } from './services/register.service';
import { FindUserService } from './services/find-user.service';
import {
  FindUserMessages,
  LoginMessages,
  RegisterMessages,
} from './auth.constants';

import { LoginDto, RegisterDto } from './dto/auth.dto';
import { User_MessageDto } from './dto/user-response.dto';
import { AcessToken_MessageDto } from './dto/login-response.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { LoggedUser } from './decorators/authenticated-user.decorator';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly loginService: LoginService,
    private readonly registerService: RegisterService,
    private readonly findUserService: FindUserService,
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

  @Get('current-user')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get current user' })
  @ZodResponse({
    description: FindUserMessages.Success,
    type: User_MessageDto,
  })
  @ApiNotFoundResponse({ description: FindUserMessages.Errors.UserNotFound(0) })
  async getCurrentUser(@LoggedUser('userId') userId: number) {
    const user = await this.findUserService.findById(userId);
    
    return {
      message: FindUserMessages.Success,
      data: user,
    };
  }
}
