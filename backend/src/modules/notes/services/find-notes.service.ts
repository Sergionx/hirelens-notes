import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/postgresql';

import { Note } from '../entities/note.entity';

@Injectable()
export class FindNotesService {
  constructor(
    @InjectRepository(Note)
    private readonly noteRepository: EntityRepository<Note>,
  ) {}

  async findAll(
    userId: number,
    archived?: boolean,
    categoryIds?: number[],
  ): Promise<Note[]> {
    return this.noteRepository.find(
      {
        author: { id: userId },
        ...(archived !== undefined ? { isArchived: archived } : {}),
        ...((categoryIds?.length ?? 0) > 0
          ? { categories: { id: { $in: categoryIds } } }
          : {}),
      },
      { populate: ['categories'] },
    );
  }

  async findOne(id: number, userId: number): Promise<Note> {
    const note = await this.noteRepository.findOne(
      { id, author: { id: userId } },
      { populate: ['categories'] },
    );
    if (!note) throw new NotFoundException(`Note with ID ${id} not found`);

    return note;
  }
}
