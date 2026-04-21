import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/core';
import { ZodSerializerDto } from 'nestjs-zod';

import { User } from '../entities/user/user.entity';
import { UserResponseDto } from '../dto/user-response.dto';
import { FindUserMessages } from '../auth.constants';

@Injectable()
export class FindUserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: EntityRepository<User>,
  ) {}

  @ZodSerializerDto(UserResponseDto)
  async findById(id: number) {
    const user = await this.userRepository.findOne(id);
    if (!user)
      throw new NotFoundException(FindUserMessages.Errors.UserNotFound(id));

    return user as UserResponseDto;
  }
}
