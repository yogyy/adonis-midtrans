import { createIdx } from '#lib/utils'
import Product from '#models/product'
import { validateCreateProduct } from '#validators/product'
import type { HttpContext } from '@adonisjs/core/http'

export default class ProductsController {
  async getProduct() {
    const data = await Product.all()

    return { status: 'success', data }
  }

  async createProduct({ request }: HttpContext) {
    const { name, price } = await request.validateUsing(validateCreateProduct)

    const id = createIdx()
    const newProduct = await Product.create({
      id,
      name,
      price,
      image: `https://picsum.photos/143/108?random=${id}`,
    })

    return {
      status: 'success',
      data: newProduct,
    }
  }
}
