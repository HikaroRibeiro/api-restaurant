/* eslint-disable no-unused-expressions */
import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('desks_session', (table) => {
    ;(table.increments('id').primary(),
      table.integer('desk_id').references('id').inTable('desks'),
      table.timestamp('opened_at').defaultTo(knex.fn.now()),
      table.timestamp('closed_at'))
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('desks_session')
}
