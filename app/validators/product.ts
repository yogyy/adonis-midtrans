import vine from '@vinejs/vine'

export const validateCreateProduct = vine.compile(
  vine.object({
    name: vine.string().minLength(3),
    price: vine.number().min(1000).withoutDecimals(),
  })
)
