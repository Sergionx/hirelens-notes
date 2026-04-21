import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/postgresql';
import { EntityManager } from '@mikro-orm/core';

import { FindUserMessages } from '@/modules/auth/auth.constants';
import { User } from '@/modules/auth/entities/user/user.entity';

import { Note } from '../entities/note.entity';
import { CreateNoteDto } from '../dto/create-note.dto';

@Injectable()
export class CreateNotesService {
  constructor(
    @InjectRepository(Note)
    private readonly noteRepository: EntityRepository<Note>,
    private readonly em: EntityManager,
  ) {}

  async create(createNoteDto: CreateNoteDto, userId: number): Promise<Note> {
    const author = await this.em.findOneOrFail(
      User,
      { id: userId },
      {
        failHandler: () =>
          new NotFoundException(FindUserMessages.Errors.UserNotFound(userId)),
      },
    );

    const { categoryIds, ...restDto } = createNoteDto;

    const note = this.noteRepository.create({
      ...restDto,
      author,
      categories: categoryIds || [],
    });

    await this.em.persist(note).flush();

    return note;
  }
}
