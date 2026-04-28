import { Entity, Column, PrimaryColumn, OneToMany } from 'typeorm';
import { Schedule } from './schedule.entity';

@Entity({ name: 'films' })
export class Film {
  @PrimaryColumn()
  id: string;

  @Column()
  rating: number;

  @Column()
  director: string;

  @Column('text', { array: true })
  tags: string[];

  @Column()
  image: string;

  @Column()
  cover: string;

  @Column()
  title: string;

  @Column()
  about: string;

  @Column()
  description: string;

  @OneToMany(() => Schedule, (schedule) => schedule.film)
  schedule: Schedule[];
}