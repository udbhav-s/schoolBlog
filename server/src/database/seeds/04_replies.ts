import * as Knex from 'knex';

export async function seed(knex: Knex) {
  // Deletes ALL existing entries
  return knex('replies')
    .del()
    .then(() => {
      // Inserts seed entries
      return knex('replies').insert([
        {
          body: 'Reply 1',
          userId: 1,
          commentId: 1,
        },
        {
          body: 'Reply 2',
          userId: 1,
          commentId: 1,
        },
      ]);
    });
}
