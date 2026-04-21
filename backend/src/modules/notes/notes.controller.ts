import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
  ParseIntPipe,
  ParseBoolPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { ZodResponse } from 'nestjs-zod';

import { CreateNotesService } from './services/create-notes.service';
import { FindNotesService } from './services/find-notes.service';
import { UpdateNotesService } from './services/update-notes.service';
import { RemoveNotesService } from './services/remove-notes.service';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { FilterNoteDto } from './dto/filter-note.dto';
import {
  Note_MessageDto,
  Note_MessageWithCategoriesDto,
  NotesList_MessageDto,
} from './dto/note-response.dto';
import {
  NoteCreateMessages,
  NoteUpdateMessages,
  NoteDeleteMessages,
  NoteArchiveMessages,
  NoteFindMessages,
} from './notes.constants';

import { NullResponseDto } from '@/schemas/common/messageResponse';

import {
  AuthenticatedUser,
  JwtAuthGuard,
} from '@/modules/auth/guards/jwt-auth.guard';
import { LoggedUser } from '@/modules/auth/decorators/authenticated-user.decorator';
import { User } from '@/modules/auth/entities/user/user.entity';

@ApiTags('notes')
@Controller('notes')
@UseGuards(JwtAuthGuard)
export class NotesController {
  constructor(
    private readonly createNotesService: CreateNotesService,
    private readonly findNotesService: FindNotesService,
    private readonly updateNotesService: UpdateNotesService,
    private readonly removeNotesService: RemoveNotesService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new note' })
  @ZodResponse({
    description: NoteCreateMessages.Success,
    type: Note_MessageWithCategoriesDto,
  })
  async create(
    @Body() createNoteDto: CreateNoteDto,
    @LoggedUser() user: AuthenticatedUser,
  ) {
    const note = await this.createNotesService.create(
      createNoteDto,
      user.userId,
    );
    return {
      message: NoteCreateMessages.Success,
      data: note,
    };
  }

  @Get()
  @ApiOperation({ summary: 'List all notes' })
  @ZodResponse({
    description: NoteFindMessages.ListSuccess,
    type: NotesList_MessageDto,
  })
  async findAll(
    @LoggedUser() user: AuthenticatedUser,
    @Query() filter: FilterNoteDto,
  ) {
    const notes = await this.findNotesService.findAll(
      user.userId,
      filter.archived,
      filter.categoryIds,
    );
    return {
      message: NoteFindMessages.ListSuccess,
      data: notes,
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific note' })
  @ZodResponse({
    description: NoteFindMessages.Success,
    type: Note_MessageDto,
  })
  async findOne(
    @Param('id', ParseIntPipe) id: number,
    @LoggedUser() user: AuthenticatedUser,
  ) {
    const note = await this.findNotesService.findOne(id, user.userId);
    return {
      message: NoteFindMessages.Success,
      data: note,
    };
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a note' })
  @ZodResponse({
    description: NoteUpdateMessages.Success,
    type: Note_MessageDto,
  })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateNoteDto: UpdateNoteDto,
    @LoggedUser() user: AuthenticatedUser,
  ) {
    const note = await this.updateNotesService.update(
      id,
      updateNoteDto,
      user.userId,
    );
    return {
      message: NoteUpdateMessages.Success,
      data: note,
    };
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a note' })
  @ZodResponse({
    description: NoteDeleteMessages.Success,
    type: NullResponseDto,
  })
  async remove(
    @Param('id', ParseIntPipe) id: number,
    @LoggedUser() user: AuthenticatedUser,
  ) {
    await this.removeNotesService.remove(id, user.userId);
    return { message: NoteDeleteMessages.Success, data: null };
  }

  @Patch(':id/archive')
  @ApiOperation({ summary: 'Archive a note' })
  @ZodResponse({
    description: NoteArchiveMessages.Archive.Success,
    type: Note_MessageDto,
  })
  async archive(
    @Param('id', ParseIntPipe) id: number,
    @LoggedUser() user: AuthenticatedUser,
  ) {
    const note = await this.updateNotesService.archive(id, user.userId);
    return {
      message: NoteArchiveMessages.Archive.Success,
      data: note,
    };
  }

  @Patch(':id/unarchive')
  @ApiOperation({ summary: 'Unarchive a note' })
  @ZodResponse({
    description: NoteArchiveMessages.Unarchive.Success,
    type: Note_MessageDto,
  })
  async unarchive(
    @Param('id', ParseIntPipe) id: number,
    @LoggedUser() user: AuthenticatedUser,
  ) {
    const note = await this.updateNotesService.unarchive(id, user.userId);
    return {
      message: NoteArchiveMessages.Unarchive.Success,
      data: note,
    };
  }
}
