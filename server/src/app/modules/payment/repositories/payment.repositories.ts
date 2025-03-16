import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Payment } from '../entities/payment.entity';

@Injectable()
export class PaymentRepository {
  constructor(
    @InjectRepository(Payment)
    private readonly paymentRepository: Repository<Payment>,
  ) {}

  async create(paymentData: Partial<Payment>): Promise<Payment> {
    const payment = this.paymentRepository.create(paymentData);
    return this.paymentRepository.save(payment);
  }

  async findById(id: number): Promise<Payment> {
    return this.paymentRepository.findOne({
      where: { id },
      relations: ['order'],
    });
  }

  async findByOrderId(orderId: number): Promise<Payment> {
    return this.paymentRepository.findOne({
      where: { order_id: orderId },
      relations: ['order'],
    });
  }

  async update(id: number, paymentData: Partial<Payment>): Promise<Payment> {
    await this.paymentRepository.update(id, paymentData);
    return this.findById(id);
  }

  async updateByOrderId(
    orderId: number,
    paymentData: Partial<Payment>,
  ): Promise<Payment> {
    const payment = await this.findByOrderId(orderId);
    if (!payment) return null;

    await this.paymentRepository.update(payment.id, paymentData);
    return this.findById(payment.id);
  }
}
