import { Entity, Column, PrimaryColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Film } from './film.entity';

@Entity({ name: 'schedules' })
export class Schedule {
  @PrimaryColumn()
  id: string;

  @Column()
  daytime: Date;

  @Column()
  hall: string;

  @Column()
  rows: number;

  @Column()
  seats: number;

  @Column()
  price: number;

  @Column()
  taken: string;

  @ManyToOne(() => Film, (film) => film.schedule)
  @JoinColumn({ name: 'filmId' })
  film: Film;

  @Column()
  filmId: string;
}