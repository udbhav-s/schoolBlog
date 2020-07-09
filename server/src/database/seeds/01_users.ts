import * as Knex from 'knex';

export async function seed(knex: Knex) {
  // Deletes ALL existing entries
  return knex('users')
    .del()
    .then(() => {
      // Inserts seed entries
      return knex('users').insert([
        {
          email: 'st9999@hpsbegumpet.fake.in',
          name: 'Example Admin Account',
          type: 'student',
          level: 4,
        },
        {
          email: 'st1234@hpsbegumpet.fake.in',
          name: 'Tom Hanks',
          type: 'student',
          level: 1,
        },
        {
          email: 'sen1234@hpsbegumpet.fake.in',
          name: 'Heath Ledger',
          type: 'teacher',
          level: 2,
        },
      ]);
    });
}
