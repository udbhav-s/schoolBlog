import { Model, QueryBuilder } from 'objection';
import { GetOptionsDto } from '../../common/dto/getOptions.dto';

export class BaseModel extends Model {
  readonly id: number;

  static modifiers = {
    getOptions(query: QueryBuilder<BaseModel>, options: GetOptionsDto) {
      if (options.limit) query.limit(options.limit);
      if (options.offset) query.offset(options.offset);
      // order options
      if (options.orderBy && options.order) {
        query.toKnexQuery().orderBy(options.orderBy, options.order);
      }
    },
  };
}
