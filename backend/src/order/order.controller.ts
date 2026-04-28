import { Body, Controller, Post } from '@nestjs/common';

import { ApiListDto } from '../films/dto/films.dto';
import { CreateOrderDto, OrderResultDto } from './dto/order.dto';
import { OrderService } from './order.service';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  createOrder(
    @Body() dto: CreateOrderDto,
  ): Promise<ApiListDto<OrderResultDto>> {
    return this.orderService.createOrder(dto);
  }
}
