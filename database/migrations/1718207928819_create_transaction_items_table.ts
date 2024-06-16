import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'transaction_items'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.string('id', 110).notNullable().primary().notNullable()
      table.string('transaction_id', 110).notNullable()
      table.string('product_id', 110).notNullable()
      table.string('product_name').notNullable()
      table.integer('price').notNullable()
      table.integer('quantity').notNullable()
      table.timestamp('created_at').defaultTo(this.now())
      table.timestamp('updated_at').defaultTo(this.now())
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
