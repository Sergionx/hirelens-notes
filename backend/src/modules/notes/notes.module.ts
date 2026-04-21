import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';

import { Note } from './entities/note.entity';
import { NotesController } from './notes.controller';
import { CreateNotesService } from './services/create-notes.service';
import { FindNotesService } from './services/find-notes.service';
import { UpdateNotesService } from './services/update-notes.service';
import { RemoveNotesService } from './services/remove-notes.service';

import { AuthModule } from '@/modules/auth/auth.module';

@Module({
  imports: [MikroOrmModule.forFeature([Note]), AuthModule],
  controllers: [NotesController],
  providers: [
    CreateNotesService,
    FindNotesService,
    UpdateNotesService,
    RemoveNotesService,
  ],
  exports: [
    CreateNotesService,
    FindNotesService,
    UpdateNotesService,
    RemoveNotesService,
  ],
})
export class NotesModule {}
