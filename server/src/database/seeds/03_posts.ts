import * as Knex from 'knex';

export async function seed(knex: Knex) {
  // Deletes ALL existing entries
  return knex('posts')
    .del()
    .then(() => {
      // Inserts seed entries
      return knex('posts').insert([
        {
          title: 'Test post',
          body: 'test post content',
          userId: 1,
          categoryId: 1,
          published: true
        },
      ]);
    });
}
