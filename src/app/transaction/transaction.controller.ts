import { Controller, Get, Header, Param, ParseIntPipe, Post, Query, Res } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Crud, CrudController, Override } from '@nestjsx/crud';
import { Methods } from '@src/common/decorators/methods.decorator';
import { Modules } from '@src/common/decorators/modules.decorator';
import { MethodName } from '@src/common/enums/methods.enum';
import { ModulesName } from '@src/common/enums/modules.enum';
import { Transaction } from '@src/entities/transaction.entity';
import { GetMany } from '@src/models/base/getMany.dto';
import { TransactionService } from './transaction.service';

@Crud({
  model: {
    type: Transaction
  },
  query: {
    join: {
      owner: {
        eager: true,
        exclude: ['password']
      }
    }
  },
  routes: {
    exclude: ['replaceOneBase', 'createManyBase', 'createOneBase']
  }
})
@Modules(ModulesName.TRANSACTION)
@ApiTags('transaction')
@Controller('transaction')
export class TransactionController implements CrudController<Transaction>{
  constructor(public service: TransactionService) { }

  @Post()
  @ApiBearerAuth()
  @Methods(MethodName.POST)
  create() {
    return this.service.createTransactionEveryMonth();
  }

  @ApiBearerAuth()
  @Methods(MethodName.GET_LIST)
  @Get('/deleted')
  getListWasDeleted(@Query() query: GetMany) {
    return this.service.getDataWasDeleted(query);
  }

  @Get('/extract-invoice/:id')
  extract(@Res() res, @Param('id', ParseIntPipe) id: number) {
    return this.service.extract(res, id);
  }

  get base(): CrudController<Transaction> {
    return this;
  }

  @Override('getOneBase')
  @ApiBearerAuth()
  @Methods(MethodName.GET)
  getOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.getOneTransaction(id);
  }
}
