/* eslint-disable @typescript-eslint/naming-convention */
import { reformTransaction } from '#lib/reform_transaction'
import Product from '#models/product'
import TransactionItems from '#models/transaction_items'
import Transactions from '#models/transactions'
import env from '#start/env'
import { validateCreateTransactions, validateTransactionStatus } from '#validators/transaction'
import type { HttpContext } from '@adonisjs/core/http'
import db from '@adonisjs/lucid/services/db'
import { nanoid } from 'nanoid'

export default class TransactionsController {
  async createTransaction({ request, response }: HttpContext) {
    const { products, customer_name, customer_email } = await request.validateUsing(
      validateCreateTransactions
    )

    const productsFromDB = await Product.query().whereIn(
      'id',
      products.map((product) => product.id)
    )

    if (productsFromDB.length === 0) {
      return response.status(403).send({ status: 'error', message: 'Products not found' })
    }

    productsFromDB.forEach((product) => {
      const productFromRequest = products.find((pr) => pr.id === product.id)
      product.quantity = productFromRequest?.quantity as number
    })

    const transaction_id = `TRX-${nanoid(4)}-${nanoid(8)}`
    const gross_amount = productsFromDB.reduce(
      (acc, product) => acc + product.quantity * product.price,
      0
    )

    const authString = btoa(env.get('MIDTRANS_SERVER_KEY') + ':')
    const payload = {
      transaction_details: {
        order_id: transaction_id,
        gross_amount,
      },
      item_details: productsFromDB.map((product) => ({
        id: product.id,
        price: product.price,
        quantity: product.quantity,
        name: product.name,
      })),
      customer_details: {
        first_name: customer_name,
        email: customer_email,
      },
      callbacks: {
        finish: `${env.get('FRONT_END_URL')}/order-status?transaction_id=${transaction_id}`,
        error: `${env.get('FRONT_END_URL')}/order-status?transaction_id=${transaction_id}`,
        pending: `${env.get('FRONT_END_URL')}/order-status?transaction_id=${transaction_id}`,
      },
    }

    const midtransRes = await fetch(`${env.get('MIDTRANS_APP_URL')}/snap/v1/transactions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Basic ${authString}`,
      },
      body: JSON.stringify(payload),
    })

    const data = (await midtransRes.json()) as { token: string; redirect_url: string }
    if (midtransRes.status !== 201) {
      return response.status(500).send({
        status: 'error',
        message: 'Failed to create transaction',
      })
    }

    await Promise.all([
      await Transactions.create({
        id: transaction_id,
        total: gross_amount,
        status: 'PENDING_PAYMENT',
        customer_name,
        customer_email,
        snap_token: data.token,
        snap_redirect_url: data.redirect_url,
      }),

      await TransactionItems.createMany(
        productsFromDB.map((product) => ({
          id: `TRX-ITEM-${nanoid(10)}`,
          transaction_id,
          product_id: product.id,
          product_name: product.name,
          price: product.price,
          quantity: product.quantity,
        }))
      ),
    ])

    return {
      status: 'success',
      data: {
        id: transaction_id,
        status: 'PENDING_PAYMENT',
        customer_name,
        customer_email,
        products: productsFromDB,
        snap_token: data.token,
        snap_redirect_url: data.redirect_url,
      },
    }
  }

  async getTransactions({ request }: HttpContext) {
    const { status } = await request.validateUsing(validateTransactionStatus)

    const transactions = await db
      .from('transactions')
      .join('transaction_items', 'transactions.id', '=', 'transaction_items.transaction_id')
      .join('product', 'product.id', '=', 'transaction_items.product_id')
      .select('transactions.*')
      .select('transaction_items.quantity')
      .select(
        'product.id as product_id',
        'product.name as product_name',
        'product.price',
        'product.image'
      )
      .where('transactions.status', status)

    return {
      status: 'success',
      data: reformTransaction(transactions),
    }
  }

  async getTransactionById({ request, response }: HttpContext) {
    const { transaction_id } = request.params()

    // const trx = await db.rawQuery(`
    //   SELECT t.*, ti.quantity,
    //   p.id AS product_id, p.name, p.price, p.image
    //   FROM transactions AS t
    //   INNER JOIN transaction_items AS ti ON t.id = ti.transaction_id
    //   INNER JOIN product AS p ON ti.product_id = p.id
    //   WHERE t.id = '${transaction_id}';`)

    const transactions = await db
      .from('transactions')
      .join('transaction_items', 'transactions.id', '=', 'transaction_items.transaction_id')
      .join('product', 'product.id', '=', 'transaction_items.product_id')
      .select('transactions.*')
      .select('transaction_items.quantity')
      .select(
        'product.id as product_id',
        'product.name as product_name',
        'product.price',
        'product.image'
      )
      .where('transactions.id', transaction_id)

    if (!transactions || transactions.length === 0) {
      return response.status(404).send({
        status: 'error',
        message: 'Transaction not found',
      })
    }

    return {
      status: 'success',
      data: reformTransaction(transactions),
    }
  }

  async updateTransactionStatus({ request }: HttpContext) {
    const { transaction_id } = request.params()
    const { status } = await request.validateUsing(validateTransactionStatus)
    const transaction = await Transactions.query()
      .where('id', transaction_id)
      .update({ status, payment_method: null })

    return {
      status: 'success',
      data: transaction,
    }
  }
}
