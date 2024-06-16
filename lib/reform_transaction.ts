interface TransactionRes {
  id: string
  total: number
  status: string
  customer_name: string
  customer_email: string
  snap_token: string
  snap_redirect_url: string
  payment_method: string
  created_at: string
  updated_at: string
  quantity: number
  product_id: string
  product_name: string
  price: number
  image: string
}

export const reformTransaction = (transaction: TransactionRes[]) => {
  return {
    id: transaction[0].id,
    total: transaction[0].total,
    status: transaction[0].status,
    customer_name: transaction[0].customer_name,
    customer_email: transaction[0].customer_email,
    snap_token: transaction[0].snap_token,
    snap_redirect_url: transaction[0].snap_redirect_url,
    payment_method: transaction[0].payment_method,
    products: transaction.map((transax) => ({
      id: transax.product_id,
      name: transax.product_name,
      price: transax.price,
      quantity: transax.quantity,
      image: transax.image,
    })),
  }
}
