import { Injectable, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/core';
import * as bcrypt from 'bcrypt';

import { User } from '../entities/user/user.entity';
import { RegisterMessages } from '../auth.constants';
import { RegisterDto } from '../dto/auth.dto';
import { UserResponseDto } from '../dto/user-response.dto';

@Injectable()
export class RegisterService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: EntityRepository<User>,
  ) {}

  async register(registerDto: RegisterDto): Promise<UserResponseDto> {
    const existingUser = await this.userRepository.findOne({
      email: registerDto.email,
    });
    if (existingUser)
      throw new ConflictException(RegisterMessages.Errors.EmailInUse);

    const hashedPassword = await bcrypt.hash(registerDto.password, 10);
    const user = this.userRepository.create({
      ...registerDto,
      password: hashedPassword,
    });

    await this.userRepository.getEntityManager().persist(user).flush();
    return user;
  }
}
