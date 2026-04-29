import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Film } from '../films/entities/film.entity';
import { Schedule } from '../films/entities/schedule.entity';

@Injectable()
export class FilmsRepository {
  constructor(
    @InjectRepository(Film)
    private filmRepo: Repository<Film>,

    @InjectRepository(Schedule)
    private scheduleRepo: Repository<Schedule>,
  ) {}

  async findAll(): Promise<Film[]> {
    return this.filmRepo.find();
  }

  async findById(id: string): Promise<Film | null> {
    return this.filmRepo.findOne({
      where: { id },
    });
  }

  async findScheduleByFilmId(id: string): Promise<Schedule[] | null> {
    return this.scheduleRepo.find({
      where: { filmId: id },
      order: { daytime: 'ASC', hall: 'ASC' },
    });
  }

  async reserveSeats(params: {
    filmId: string;
    sessionId: string;
    seatKeys: string[];
  }): Promise<Schedule | null> {
    const schedule = await this.scheduleRepo.findOne({
      where: { id: params.sessionId, filmId: params.filmId },
    });

    if (!schedule) return null;

    const takenSeats = schedule.taken
      ? schedule.taken.split(',').map((seat) => seat.trim()).filter(Boolean)
      : [];

    const alreadyTaken = takenSeats.some((seat) =>
      params.seatKeys.includes(seat),
    );

    if (alreadyTaken) return null;

    schedule.taken = [...takenSeats, ...params.seatKeys].join(',');

    await this.scheduleRepo.save(schedule);

    return schedule;
  }
}