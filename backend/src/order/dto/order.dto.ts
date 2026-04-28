export class OrderTicketDto {
  film!: string;
  session!: string;
  row!: number;
  seat!: number;
}

export class CreateOrderDto {
  email!: string;
  phone!: string;
  tickets!: OrderTicketDto[];
}

export class OrderResultDto extends OrderTicketDto {
  id!: string;
  daytime!: string;
  price!: number;
}
