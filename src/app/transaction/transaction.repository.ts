import { Transaction } from '@src/entities/transaction.entity';
import { Repository, EntityRepository } from 'typeorm';
@EntityRepository(Transaction)
export class TransactionRepository extends Repository<Transaction> {
 
}
