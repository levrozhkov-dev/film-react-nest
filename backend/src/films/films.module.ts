import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Schema } from 'mongoose';

import { FilmsController } from './films.controller';
import { FilmsService } from './films.service';
import { FilmsRepository } from '../repository/films.repository';

const scheduleSchema = new Schema(
  {
    id: String,
    daytime: Date,
    hall: Schema.Types.Mixed,
    rows: Number,
    seats: Number,
    price: Number,
    taken: { type: [String], default: [] },
  },
  { _id: false },
);

const filmSchema = new Schema(
  {
    id: { type: String, required: true, unique: true },
    rating: Number,
    director: String,
    tags: [String],
    image: String,
    cover: String,
    title: String,
    about: String,
    description: String,
    schedule: { type: [scheduleSchema], default: [] },
  },
  { collection: 'films', versionKey: false },
);

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Film', schema: filmSchema }], 'afisha'),
  ],
  controllers: [FilmsController],
  providers: [FilmsService, FilmsRepository],
  exports: [FilmsRepository],
})
export class FilmsModule {}
