import express from 'express';
import { createOrder } from '../Controllers/order';

const router = express.Router();

router.post('/create', createOrder);

export default router;
