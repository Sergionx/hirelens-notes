import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { AuthController } from './auth.controller';
import { User } from './entities/user/user.entity';
import { JwtStrategy } from './jwt.strategy';
import { LoginService } from './services/login.service';
import { RegisterService } from './services/register.service';

@Module({
  imports: [
    MikroOrmModule.forFeature([User]),
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>(
          'JWT_SECRET',
          'hirelens-super-secret',
        ),
        signOptions: { expiresIn: '60m' },
      }),
    }),
  ],
  providers: [LoginService, RegisterService, JwtStrategy],
  controllers: [AuthController],
  exports: [LoginService, RegisterService],
})
export class AuthModule {}
