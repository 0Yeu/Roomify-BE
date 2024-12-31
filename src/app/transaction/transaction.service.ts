import { Injectable, NotFoundException } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { BaseService } from '@src/base.service';
import { Transaction } from '@src/entities/transaction.entity';
import { IResponseFormat } from '@src/models/base/response.interface';
import stringify from 'csv-stringify';
import fs from 'fs';
import { BookingRepository } from '../booking/booking.respository';
import { TransactionRepository } from './transaction.repository';

@Injectable()
export class TransactionService extends BaseService<Transaction, TransactionRepository> {
  constructor(protected readonly repository: TransactionRepository, private readonly bookingRepository: BookingRepository) {
    super(repository);
  }

  async getOneTransaction(id: number): Promise<IResponseFormat<Transaction>> {
    const data = await this.repository.findOne({ where: { id }, relations: ['bookings', 'owner'] });
    if (!data) throw new NotFoundException('Transaction not found !!!');
    return { data };
  }

  @Cron(CronExpression.EVERY_1ST_DAY_OF_MONTH_AT_NOON)
  async createTransactionEveryMonth() {
    const bookings = await this.bookingRepository.getDistinctOwner();
    console.log('ownerId ---------> ', bookings);
    for(let i = 0; i < bookings.length; i += 1) {
      const transaction = this.repository.create();
      transaction.isPaid = false;
      transaction.ownerId = bookings[i].ownerId;
      const create = await this.repository.save(transaction);
      await this.bookingRepository.update({ transactionId: null, ownerId: bookings[i].ownerId }, { transactionId: create.id });
    }

  }

  async extract(res, id: number) {
    const query = await this.repository.findOne({ where: { id }, relations: ['bookings', 'bookings.user', 'bookings.room'] });
    if (!query) throw new NotFoundException('Transaction not found');
    await this.repository.update(id, { isPaid: true });
    const { bookings } = query;
    const dataConvert = [];
    bookings.forEach(booking => {
      dataConvert.push({
        id: booking.id,
        username: booking.user.fullName,
        phone: booking.user.phone,
        email: booking.user.email,
        roomName: booking.room.name,
        createdAt: booking.createdAt.toUTCString()
      });
    });
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `${'attachment; filename=\"' + 'invoice-'}${Date.now()}.csv\"`);
    return stringify(dataConvert, { header: true }).pipe(res);

  }
}
