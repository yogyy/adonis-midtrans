import vine from '@vinejs/vine'

export const validateCreateTransactions = vine.compile(
  vine.object({
    products: vine.array(
      vine.object({
        id: vine.string(),
        // name: vine.string(),
        // price: vine.number().withoutDecimals(),
        quantity: vine.number().min(1),
      })
    ),
    customer_name: vine.string().minLength(3),
    customer_email: vine.string().email(),
  })
)
export const validateTransactionStatus = vine.compile(
  vine.object({
    status: vine.enum(['PENDING_PAYMENT', 'PAID', 'CANCELED']),
  })
)

export const validateTransaction = vine.compile(
  vine.object({
    products: vine.array(vine.string()),
  })
)
