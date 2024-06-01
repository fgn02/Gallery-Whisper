import express from 'express';
import {addOrderItems, getOrderById, updateOrderToPaid, updateOrderToDelivered, 
    getAllOrders, myOrders, updateOrderToCancel,filterOrder,
    myFilterOrders, getSales, getTopProducts, getProductCategoriesSortedByOrders} from '../controllers/orderController.js';
import {protect, admin} from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', protect, addOrderItems);
router.get('/admin', protect, getAllOrders);
router.get('/:orderId', getOrderById);
router.put('/:orderId/pay', updateOrderToPaid);
router.put('/:orderId/deliver',protect, updateOrderToDelivered);
router.get('/myorders/:userId',protect, myOrders);
router.get('/myorders/:userId/filter/:filter',protect, myFilterOrders);
router.put('/cancel',protect, updateOrderToCancel);
router.get('/filter/:filter',protect, filterOrder);
router.get('/admin/totalSale', protect, getSales);
router.get('/admin/topProduct', protect, getTopProducts);
router.get('/admin/topCategory', protect, getProductCategoriesSortedByOrders);

export default router;