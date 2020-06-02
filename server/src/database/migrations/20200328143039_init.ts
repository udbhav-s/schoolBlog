import * as Knex from 'knex';

// creates the tables
export async function up(knex: Knex): Promise<any> {
  return (
    knex.schema
      // users table
      .createTable('users', table => {
        table.increments();
        table.string('name').notNullable();
        table
          .string('portal_id')
          .unique()
          .notNullable();
        // student/teacher/etc
        table.string('type');
        // decides which permissons the user has
        table
          .integer('level')
          .unsigned()
          .defaultTo(1)
          .notNullable();
        table.timestamps(true, true);
      })
      // categories table
      .createTable('categories', table => {
        table.increments();
        table.string('name').notNullable();
        table.timestamps(true, true);
      })
      // posts table
      .createTable('posts', table => {
        table.increments();
        table.string('title').notNullable();
        table.text('body');
        table.string('thumbnail');
        table
          .boolean('verified')
          .notNullable()
          .defaultTo(false);
        table
          .boolean('published')
          .notNullable()
          .defaultTo(false);
        // post author
        table
          .integer('user_id')
          .unsigned()
          .notNullable();
        table
          .foreign('user_id')
          .references('id')
          .inTable('users')
          .onDelete('CASCADE');
        // category
        table.integer('category_id').unsigned();
        table
          .foreign('category_id')
          .references('id')
          .inTable('categories')
          .onDelete('SET NULL');
        table.timestamps(true, true);
      })
      // comments table
      .createTable('comments', table => {
        table.increments();
        table.text('body').notNullable();
        table
          .boolean('edited')
          .notNullable()
          .defaultTo(false);
        // comment author
        table
          .integer('user_id')
          .unsigned()
          .notNullable();
        table
          .foreign('user_id')
          .references('id')
          .inTable('users')
          .onDelete('CASCADE');
        // post author
        table
          .integer('post_id')
          .unsigned()
          .notNullable();
        table
          .foreign('post_id')
          .references('id')
          .inTable('posts')
          .onDelete('CASCADE');
        table.timestamps(true, true);
      })
      // replies table
      .createTable('replies', table => {
        table.increments();
        table.text('body').notNullable();
        table
          .boolean('edited')
          .notNullable()
          .defaultTo(false);
        // comment author
        table
          .integer('user_id')
          .unsigned()
          .notNullable();
        table
          .foreign('user_id')
          .references('id')
          .inTable('users')
          .onDelete('CASCADE');
        // parent comment
        table
          .integer('comment_id')
          .unsigned()
          .notNullable();
        table
          .foreign('comment_id')
          .references('id')
          .inTable('comments')
          .onDelete('CASCADE');
        table.timestamps(true, true);
      })
      // files table
      .createTable('files', table => {
        table.increments();
        table.text('filename').notNullable();
        // id of the post with the file
        table
          .integer('post_id')
          .unsigned()
          .notNullable();
        table
          .foreign('post_id')
          .references('id')
          .inTable('posts')
          .onDelete('CASCADE');
        table.timestamps(true, true);
      })
  );
}

// deletes the tables
export async function down(knex: Knex) {
  return knex.schema
    .dropTableIfExists('files')
    .dropTableIfExists('replies')
    .dropTableIfExists('comments')
    .dropTableIfExists('posts')
    .dropTableIfExists('categories')
    .dropTableIfExists('users');
}
