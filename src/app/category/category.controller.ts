import { TreeRepository } from 'typeorm';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { Category } from 'src/entities/category.entity';
import {
  Controller,
  BadRequestException,
  InternalServerErrorException,
  ConflictException,
  Get,
  UsePipes
} from '@nestjs/common';
import { Crud, CrudController, ParsedBody, Override } from '@nestjsx/crud';
import { InjectRepository } from '@nestjs/typeorm';
import { Methods } from '@src/common/decorators/methods.decorator';
import { ModulesName } from '@src/common/enums/modules.enum';
import { Modules } from '@src/common/decorators/modules.decorator';
import { method } from '@src/constant/config-crud.constant';
import { CategoryService } from './category.service';
import { CategoryRepository } from './category.repository';

@Crud({
  model: {
    type: Category
  },
  routes: {
    getManyBase: {
      decorators: []
    },
    getOneBase: {
      decorators: []
    }
  }
})
@ApiTags('categories')
@Controller('category')
@Modules(ModulesName.CATEGORY)
export class CategoryController implements CrudController<Category> {
  constructor(
    public service: CategoryService,
    private readonly repository: CategoryRepository
  ) { }

  get base(): CrudController<Category> {
    return this;
  }

  // @Override('createOneBase')
  // async createOneOverride(@ParsedBody() dto: Category) {
  //   try {
  //     // let cateObject: Category;
  //     const cateObject = dto;
  //     if (dto.parentId) {
  //       const parentObject = await this.repository.findOne(dto.parentId);
  //       if (parentObject) {
  //         cateObject.parent = parentObject;
  //       } else {
  //         return new BadRequestException([
  //           {
  //             constraints: {
  //               isForeignKey: 'parentId must be an existed foreign key'
  //             },
  //             property: 'parentId'
  //           }
  //         ]).getResponse();
  //       }
  //     }
  //     cateObject.slug = createSlug(cateObject.name);
  //     const result = this.repository.create(cateObject);
  //     await this.repository.save(result);
  //     return result;
  //   } catch (error) {
  //     console.log(error);
  //     if (error.code === '23505') {
  //       throw new ConflictException();
  //     }
  //     throw new InternalServerErrorException();
  //   }
  // }

  // @Get('/all')
  // @Methods('GET')
  // @UsePipes(ValidationPipe)

  // // @UseFilters(HttpExceptionFilter)
  // // @UseGuards(JwtAuthGuard)
  // // @UseGuards(RolesGuard)
  // // @ApiBearerAuth()
  // getAll() {
  //   try {
  //     return this.repository.find();
  //   } catch (error) {
  //     throw new InternalServerErrorException();
  //   }
  // }

  // @Override('getManyBase')
  // async getManyOverride() {
  //   const category = await this.treeRepository.findTrees();
  //   console.log('hello', category);
  //   return category;
  // }
}
