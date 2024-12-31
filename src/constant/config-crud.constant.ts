import { CrudGlobalConfig } from '@nestjsx/crud';
import { MethodName } from '../common/enums/methods.enum';
import { Methods } from '../common/decorators/methods.decorator';

export const method = {
  getOneBase: {
    decorators: [Methods(MethodName.GET)]
  },
  getManyBase: {
    decorators: [Methods(MethodName.GET_LIST)]
  },
  deleteOneBase: {
    decorators: [Methods(MethodName.DELETE)]
  },
  replaceOneBase: {
    decorators: [Methods(MethodName.PUT)]
  },
  updateOneBase: {
    decorators: [Methods(MethodName.PATCH)]
  },
  createOneBase: {
    decorators: [Methods(MethodName.POST)]
  },
  createManyBase: {
    decorators: [Methods(MethodName.POST)]
  }
};

export const configCRUD:CrudGlobalConfig = {
  query: {
    limit: 15,
    maxLimit: 20,
    alwaysPaginate: true
  },
  params: {
    id: {
      field: 'id',
      type: 'number',
      primary: true
    }
  },
  routes: method
};
