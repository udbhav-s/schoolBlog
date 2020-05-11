import { Post } from '.';

export interface Category {
  name: string;
  posts?: Post[];
};