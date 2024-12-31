import { Category } from 'src/entities/category.entity';
import { EntityRepository, TreeRepository } from 'typeorm';

@EntityRepository(Category)
export class CategoryRepository extends TreeRepository<Category>{}
