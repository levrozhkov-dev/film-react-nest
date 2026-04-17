import { Controller, Get, Param } from '@nestjs/common';

import { ApiListDto, FilmDto, ScheduleDto } from './dto/films.dto';
import { FilmsService } from './films.service';

@Controller('films')
export class FilmsController {
  constructor(private readonly filmsService: FilmsService) {}

  @Get()
  getFilms(): Promise<ApiListDto<FilmDto>> {
    return this.filmsService.getFilms();
  }

  @Get(':id/schedule')
  getSchedule(@Param('id') id: string): Promise<ApiListDto<ScheduleDto>> {
    return this.filmsService.getFilmSchedule(id);
  }
}
