import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  async up() {
    this.schema.alterTable('transaction_items', (table) => {
      table
        .string('product_id', 110)
        .unsigned()
        .references('product.id')
        .onUpdate('RESTRICT')
        .notNullable()
        .index()
        .alter()
      table
        .string('transaction_id', 110)
        .unsigned()
        .references('transactions.id')
        .onUpdate('RESTRICT')
        .notNullable()
        .index()
        .alter()
    })
  }

  async down() {
    this.schema.dropTable('transaction_items')
  }
}
