import { BaseModel, column, manyToMany } from '@adonisjs/lucid/orm'
import { DateTime } from 'luxon'
import Transactions from './transactions.js'
import type { ManyToMany } from '@adonisjs/lucid/types/relations'
import Product from './product.js'

export type TransactionStatus = 'PENDING_PAYMENT' | 'PAID' | 'CANCELED'
export default class TransactionItems extends BaseModel {
  @column({ isPrimary: true })
  declare id: string

  @column()
  declare transaction_id: string

  @column()
  declare product_id: string

  @column()
  declare product_name: string

  @column()
  declare price: number

  @column()
  declare quantity: number

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @manyToMany(() => Transactions)
  declare transactions: ManyToMany<typeof Transactions>

  @manyToMany(() => Product)
  declare products: ManyToMany<typeof Product>
}
