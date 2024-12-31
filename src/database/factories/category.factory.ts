import { define } from 'typeorm-seeding';
import * as Faker from 'faker';
import _ from 'lodash';
import { createSlug } from '../../utils/helper';
import { Category } from '../../entities/category.entity';

define(Category, (
  faker: typeof Faker,
  context: {payload?: Category, parent?: Category}
) => {
  const { payload, parent } = context;

  const name = payload.name || faker.lorem.word();
  const slug = createSlug(name);

  const category = new Category();
  category.name = name;
  category.slug = slug;
  if(_.isUndefined(parent)) {
    return category;
  }
  // category.parent = parent;
  return category;
});
