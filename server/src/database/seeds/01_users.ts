import * as Knex from 'knex';

export async function seed(knex: Knex) {
  // Deletes ALL existing entries
  return knex('users')
    .del()
    .then(() => {
      // Inserts seed entries
      return knex('users').insert([
        {
          portalId: 'st9999',
          name: 'Example Admin Account',
          type: 'student',
          level: 4,
        },
        {
          portalId: 'st1234',
          name: 'Tom Hanks',
          type: 'student',
          level: 1,
        },
        {
          portalId: 'sen1234',
          name: 'Heath Ledger',
          type: 'teacher',
          level: 2,
        }
      ]);
    });
}
