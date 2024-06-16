import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'product'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.string('id', 110)
      table.string('name')
      table.integer('price')
      table.string('image').nullable()
      table.timestamp('created_at').defaultTo(this.now())
      table.timestamp('updated_at').defaultTo(this.now())
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
