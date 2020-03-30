import * as Knex from 'knex';

export async function seed(knex: Knex) {
  // Deletes ALL existing entries
  return knex('users')
    .del()
    .then(() => {
      // Inserts seed entries
      return knex('users').insert([
        {
          // id: 1, //id not needed for Postgres because it auto increments
          name: 'Hasan Uddin',
          portalId: 'st9999',
          type: 'student',
          level: 4,
        },
        {
          // id: 2,
          name: 'Michael Jackson',
          portalId: 'sen0313',
          type: 'teacher',
          level: 2,
        },
      ]);
    });
}
