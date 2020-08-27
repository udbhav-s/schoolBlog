import * as Knex from "knex";

export async function up(knex: Knex): Promise<any> {
  return knex.schema
    .createTable('notifications', table => {
      table.increments();
      table
        .integer('recipient_id')
        .unsigned()
        .notNullable();
      table
        .foreign('recipient_id')
        .references('id')
        .inTable('users')
        .onDelete('CASCADE');
      table
        .integer('sender_id')
        .unsigned()
      table
        .foreign('sender_id')
        .references('id')
        .inTable('users')
        .onDelete('CASCADE');
      table.enu('action', ['comment', 'reply']);
      table.integer('object_id').unsigned();
      table.timestamps(true, true);
    });
}

export async function down(knex: Knex): Promise<any> {
  return knex.schema
    .dropTableIfExists('notifications');
}
