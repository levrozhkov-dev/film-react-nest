import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, HydratedDocument } from 'mongoose';

export type ScheduleEntity = {
  id: string;
  daytime: Date;
  hall: string | number;
  rows: number;
  seats: number;
  price: number;
  taken: string[];
};

export type FilmEntity = {
  id: string;
  rating: number;
  director: string;
  tags: string[];
  image: string;
  cover: string;
  title: string;
  about: string;
  description: string;
  schedule: ScheduleEntity[];
};

export type FilmDocument = HydratedDocument<FilmEntity>;

@Injectable()
export class FilmsRepository {
  constructor(
    @InjectModel('Film', 'afisha')
    private readonly filmModel: Model<FilmDocument>,
  ) {}

  async findAll(): Promise<FilmDocument[]> {
    return this.filmModel.find().exec();
  }

  async findById(id: string): Promise<FilmDocument | null> {
    return this.filmModel.findOne({ id }).exec();
  }

  async findScheduleByFilmId(id: string): Promise<ScheduleEntity[] | null> {
    const film = await this.filmModel.findOne({ id }).exec();
    return film?.schedule ?? null;
  }

  async reserveSeats(params: {
    filmId: string;
    sessionId: string;
    seatKeys: string[];
  }): Promise<ScheduleEntity | null> {
    const updated = await this.filmModel.findOneAndUpdate(
      {
        id: params.filmId,
        schedule: {
          $elemMatch: {
            id: params.sessionId,
            taken: { $nin: params.seatKeys },
          },
        },
      },
      {
        $addToSet: {
          'schedule.$.taken': { $each: params.seatKeys },
        },
      },
      { new: true },
    );

    return updated?.schedule.find((s) => s.id === params.sessionId) ?? null;
  }
}
