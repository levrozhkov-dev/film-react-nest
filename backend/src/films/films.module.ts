import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { FilmsController } from './films.controller';
import { FilmsService } from './films.service';
import { FilmsRepository } from '../repository/films.repository';
import { Film } from '../films/entities/film.entity';
import { Schedule } from '../films/entities/schedule.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Film, Schedule]),
  ],
  controllers: [FilmsController],
  providers: [FilmsService, FilmsRepository],
  exports: [FilmsRepository],
})
export class FilmsModule {}