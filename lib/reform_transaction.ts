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

export const reformTransaction = (transaction: TransactionRes) => {
  return {
    id: transaction.id,
    total: transaction.total,
    status: transaction.status,
    customer_name: transaction.customer_name,
    customer_email: transaction.customer_email,
    snap_token: transaction.snap_token,
    snap_redirect_url: transaction.snap_redirect_url,
    payment_method: transaction.payment_method,
    products: {
      id: transaction.product_id,
      name: transaction.product_name,
      price: transaction.price,
      quantity: transaction.quantity,
      image: transaction.image,
    },
  }
}
