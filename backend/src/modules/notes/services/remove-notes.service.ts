import { Injectable } from '@nestjs/common';
import { EntityManager } from '@mikro-orm/core';

import { FindNotesService } from './find-notes.service';

@Injectable()
export class RemoveNotesService {
  constructor(
    private readonly em: EntityManager,
    private readonly findNotesService: FindNotesService,
  ) {}

  async remove(id: number, userId: number): Promise<void> {
    const note = await this.findNotesService.findOne(id, userId);
    this.em.remove(note);
    await this.em.flush();
  }
}
