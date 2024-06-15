import { BaseModel, column, hasMany } from '@adonisjs/lucid/orm'
import { DateTime } from 'luxon'
import TransactionItems from './transaction_items.js'
import type { HasMany } from '@adonisjs/lucid/types/relations'

type TransactionStatus = 'PENDING_PAYMENT' | 'PAID' | 'CANCELED'
export default class Transactions extends BaseModel {
  @column({ isPrimary: true })
  declare id: string

  @column()
  declare total: number

  @column()
  declare status: TransactionStatus

  @column()
  declare customer_name: string

  @column()
  declare customer_email: string

  @column()
  declare snap_token: string | null

  @column()
  declare snap_redirect_url: string | null

  @column()
  declare payment_method: string | null

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @hasMany(() => TransactionItems)
  declare transaction_items: HasMany<typeof TransactionItems>
}
