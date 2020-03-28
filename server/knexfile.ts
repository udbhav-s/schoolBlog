import 'dotenv/config';
import * as Knex from 'knex';
import { knexSnakeCaseMappers } from 'objection';

module.exports = {
  client: 'pg',
  connection: {
    user: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME
  },
  migrations: {
    directory: './src/database/migrations',
    stub: './src/database/migration.stub'
  },
  seeds: {
    directory: './src/database/seeds',
    stub: './src/database/seed.stub'
  },
  ...knexSnakeCaseMappers()
} as Knex.Config;