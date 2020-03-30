import * as Knex from 'knex';

export async function seed(knex: Knex) {
  // Deletes ALL existing entries
  return knex('posts')
    .del()
    .then(() => {
      // Inserts seed entries
      return knex('posts').insert([
        {
          // id: 1,
          title: 'Hasan Uddin tops ISC with 100% in all subjects',
          body:
            'Class 12 student Hasan Uddin made history today by being the first HPS student to get 100% in all subjects',
          category: 'report',
          userId: 1,
        },
        {
          // id: 2,
          title: 'test post 123',
          body: 'testing',
          category: 'announcement',
          userId: 2,
        },
      ]);
    });
}
