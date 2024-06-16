/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'
const TransactionsController = () => import('#controllers/transactions_controller')
const ProductsController = () => import('#controllers/products_controller')

router.get('/products', [ProductsController, 'getProduct'])
router.post('/products', [ProductsController, 'createProduct'])

router.post('/transactions', [TransactionsController, 'createTransaction'])
router.get('/transactions', [TransactionsController, 'getTransactions'])
router.get('/transactions/:transaction_id', [TransactionsController, 'getTransactionById'])
router.put('/transactions/:transaction_id', [TransactionsController, 'updateTransactionStatus'])
