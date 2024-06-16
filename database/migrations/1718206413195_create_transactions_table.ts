import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'transactions'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.string('id', 110).notNullable().primary().notNullable()
      table.integer('total').notNullable()
      table
        .enum('status', ['PENDING_PAYMENT', 'PAID', 'CANCELED'], {
          useNative: true,
          enumName: 'transactions_status',
          existingType: true,
        })
        .notNullable()
      table.string('customer_name').notNullable()
      table.string('customer_email').notNullable()
      table.string('snap_token')
      table.string('snap_redirect_url')
      table.string(' payment_method')
      table.timestamp('created_at').defaultTo(this.now())
      table.timestamp('updated_at').defaultTo(this.now())
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
