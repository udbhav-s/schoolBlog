import { SetMetadata } from '@nestjs/common';
import { Levels } from '../level.enum';

export const Level = (level: Levels) => SetMetadata('level', level);