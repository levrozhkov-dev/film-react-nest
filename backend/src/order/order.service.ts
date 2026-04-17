import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { randomUUID } from 'node:crypto';

import { FilmsRepository } from '../repository/films.repository';
import { ApiListDto } from '../films/dto/films.dto';
import {
  CreateOrderDto,
  OrderResultDto,
  OrderTicketDto,
} from './dto/order.dto';

type TicketKey = `${number}:${number}`;

function toSeatKey(ticket: Pick<OrderTicketDto, 'row' | 'seat'>): TicketKey {
  return `${ticket.row}:${ticket.seat}`;
}

@Injectable()
export class OrderService {
  constructor(private readonly filmsRepo: FilmsRepository) {}

  async createOrder(dto: CreateOrderDto): Promise<ApiListDto<OrderResultDto>> {
    if (!dto || !Array.isArray(dto.tickets) || dto.tickets.length === 0) {
      throw new BadRequestException({ error: 'Bad Request' });
    }

    const bySession = new Map<
      string,
      { filmId: string; sessionId: string; tickets: OrderTicketDto[] }
    >();

    for (const t of dto.tickets) {
      if (!t?.film || !t?.session) {
        throw new BadRequestException({ error: 'Bad Request' });
      }

      const key = `${t.film}:${t.session}`;
      const group = bySession.get(key);

      if (group) group.tickets.push(t);
      else
        bySession.set(key, {
          filmId: t.film,
          sessionId: t.session,
          tickets: [t],
        });
    }

    const results: OrderResultDto[] = [];

    for (const group of bySession.values()) {
      const schedule = await this.filmsRepo.findScheduleByFilmId(group.filmId);
      if (!schedule) throw new NotFoundException({ error: 'Not Found' });

      const session = schedule.find((s) => s.id === group.sessionId);
      if (!session) throw new NotFoundException({ error: 'Not Found' });

      const seatKeys = group.tickets.map(toSeatKey);

      const updatedSession = await this.filmsRepo.reserveSeats({
        filmId: group.filmId,
        sessionId: group.sessionId,
        seatKeys,
      });

      if (!updatedSession) {
        throw new BadRequestException({ error: 'Seat already taken' });
      }

      for (const t of group.tickets) {
        results.push({
          id: randomUUID(),
          film: group.filmId,
          session: group.sessionId,
          row: t.row,
          seat: t.seat,
          daytime: updatedSession.daytime.toISOString(),
          price: updatedSession.price,
        });
      }
    }

    return { total: results.length, items: results };
  }
}
