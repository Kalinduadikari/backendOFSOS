import express from 'express';
import { createOrder, getOrders } from '../Controllers/order';

const router = express.Router();

router.post('/create', createOrder);
router.get('/getOrders', getOrders); 

export default router;
