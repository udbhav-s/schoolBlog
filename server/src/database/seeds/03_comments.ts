import * as Knex from "knex";

export async function seed(knex: Knex) {
	// Deletes ALL existing entries
	return knex('comments').del()
		.then(() => {
			// Inserts seed entries
			return knex('comments').insert([
				{
					// id: 1,
					body: 'Congrats Hasan!!!',
					user_id: 2,
					post_id: 1,
				},
			]);
		});
};
