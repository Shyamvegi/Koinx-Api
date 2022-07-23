import express from 'express';
import * as controller from "./handlers.js"
const router = express.Router();
router.get('/',controller.home);
router.get('/getTransactions',controller.getTransactions);
router.get('/getBalance',controller.getBalance);
router.get('*',controller.exitHandler);
export default router;