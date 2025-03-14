import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Payment } from '../entities/payment.entity';
import { CreatePaymentInput } from '../services/types/create-payment.input';
import { PaymentStatus } from '../enums/payment-status.enum';

@Injectable()
export class PaymentRepository {
  constructor(
    @InjectRepository(Payment)
    private paymentRepository: Repository<Payment>,
    private dataSource: DataSource,
  ) {}

  async createPayment(
    createPaymentInput: CreatePaymentInput,
  ): Promise<Payment> {
    const payment = this.paymentRepository.create({
      ...createPaymentInput,
      status: PaymentStatus.PENDING,
    });
    return this.paymentRepository.save(payment);
  }

  async findPaymentById(id: number): Promise<Payment> {
    return this.paymentRepository.findOne({
      where: { id },
      relations: ['orders'],
    });
  }

  async findPaymentsByOrderId(orderId: number): Promise<Payment[]> {
    return this.paymentRepository.find({
      where: { order_id: orderId },
      order: { created_at: 'DESC' },
    });
  }

  async updatePaymentStatus(
    id: number,
    status: PaymentStatus,
    transactionData?: Record<string, any>,
  ): Promise<Payment> {
    const payment = await this.findPaymentById(id);
    if (!payment) {
      return null;
    }

    // Cập nhật trạng thái và thông tin giao dịch
    payment.status = status;
    if (transactionData) {
      payment.transaction_id = transactionData.vnp_TransactionNo;
      payment.payment_time = new Date(transactionData.vnp_PayDate);
      payment.payment_data = transactionData;
      if (status === PaymentStatus.FAILED) {
        payment.error_message = transactionData.vnp_Message || 'Payment failed';
      }
    }

    return this.paymentRepository.save(payment);
  }

  async getPaymentStatistics(orderId: number): Promise<{
    total: number;
    successful: number;
    failed: number;
    pending: number;
  }> {
    const payments = await this.paymentRepository.find({
      where: { order_id: orderId },
    });

    return {
      total: payments.length,
      successful: payments.filter((p) => p.status === PaymentStatus.SUCCESS)
        .length,
      failed: payments.filter((p) => p.status === PaymentStatus.FAILED).length,
      pending: payments.filter((p) => p.status === PaymentStatus.PENDING)
        .length,
    };
  }

  async findLatestPayment(orderId: number): Promise<Payment> {
    return this.paymentRepository.findOne({
      where: { order_id: orderId },
      order: { created_at: 'DESC' },
    });
  }

  async createPaymentWithTransaction(
    createPaymentInput: CreatePaymentInput,
  ): Promise<Payment> {
    return this.dataSource.transaction(async (transactionalEntityManager) => {
      const payment = transactionalEntityManager.create(Payment, {
        ...createPaymentInput,
        status: PaymentStatus.PENDING,
      });
      return transactionalEntityManager.save(Payment, payment);
    });
  }

  async updatePaymentWithTransaction(
    id: number,
    updateData: Partial<Payment>,
  ): Promise<Payment> {
    return this.dataSource.transaction(async (transactionalEntityManager) => {
      const payment = await transactionalEntityManager.findOne(Payment, {
        where: { id },
      });

      if (!payment) {
        return null;
      }

      Object.assign(payment, updateData);
      return transactionalEntityManager.save(Payment, payment);
    });
  }

  async deletePayment(id: number): Promise<boolean> {
    const result = await this.paymentRepository.delete(id);
    return result.affected > 0;
  }
}
