import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  async up() {
    this.schema.alterTable('product', (table) => {
      table.string('id', 110).primary().notNullable().alter()
      table.string('name').notNullable().alter()
      table.integer('price').notNullable().alter()
    })
  }

  async down() {
    this.schema.dropTable('product')
  }
}
