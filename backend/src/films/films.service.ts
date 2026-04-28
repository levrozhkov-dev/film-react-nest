import { Injectable, NotFoundException } from '@nestjs/common';

import { FilmsRepository } from '../repository/films.repository';
import { ApiListDto, FilmDto, ScheduleDto } from './dto/films.dto';

@Injectable()
export class FilmsService {
  constructor(private readonly filmsRepo: FilmsRepository) {}

  async getFilms(): Promise<ApiListDto<FilmDto>> {
    const films = await this.filmsRepo.findAll();

    const items: FilmDto[] = films.map((f) => ({
      id: f.id,
      rating: f.rating,
      director: f.director,
      tags: f.tags,
      title: f.title,
      about: f.about,
      description: f.description,
      image: f.image,
      cover: f.cover,
    }));

    return { total: items.length, items };
  }

  async getFilmSchedule(filmId: string): Promise<ApiListDto<ScheduleDto>> {
    const schedule = await this.filmsRepo.findScheduleByFilmId(filmId);

    if (!schedule) {
      throw new NotFoundException({ error: 'Not Found' });
    }

    const items: ScheduleDto[] = schedule.map((s) => ({
      id: s.id,
      daytime: new Date(s.daytime).toISOString(),
      hall: String(s.hall),
      rows: s.rows,
      seats: s.seats,
      price: s.price,
      taken: s.taken,
    }));

    return { total: items.length, items };
  }
}
