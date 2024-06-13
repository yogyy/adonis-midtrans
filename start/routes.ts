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

router.post('/', [TransactionsController, 'createTransaction'])
router.get('/products', [ProductsController, 'getProduct'])
router.post('/product', [ProductsController, 'createProduct'])
