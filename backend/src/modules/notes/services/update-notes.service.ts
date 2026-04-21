import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/postgresql';
import { EntityManager } from '@mikro-orm/core';

import { Category } from '@/modules/categories/entities/category.entity';

import { Note } from '../entities/note.entity';
import { UpdateNoteDto } from '../dto/update-note.dto';
import { FindNotesService } from './find-notes.service';

@Injectable()
export class UpdateNotesService {
  constructor(
    @InjectRepository(Note)
    private readonly noteRepository: EntityRepository<Note>,
    private readonly em: EntityManager,
    private readonly findNotesService: FindNotesService,
  ) {}

  async update(
    id: number,
    updateNoteDto: UpdateNoteDto,
    userId: number,
  ): Promise<Note> {
    const note = await this.findNotesService.findOne(id, userId);

    const { categoryIds, ...restDto } = updateNoteDto;
    this.noteRepository.assign(note, restDto);

    if (categoryIds !== undefined) {
      await note.categories.init();
      note.categories.set(
        categoryIds.map((catId) => this.em.getReference(Category, catId)),
      );
    }

    await this.em.flush();
    return note;
  }

  async archive(id: number, userId: number): Promise<Note> {
    return this.update(id, { isArchived: true }, userId);
  }

  async unarchive(id: number, userId: number): Promise<Note> {
    return this.update(id, { isArchived: false }, userId);
  }
}
