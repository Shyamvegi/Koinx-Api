import express from 'express';
import * as controller from "./handlers.js"
const router = express.Router();
router.get('/',controller.home);
router.get('/getTransactions/:userAddress',controller.getTransactions);
router.get('/getBalance/:userAddress',controller.getBalance);
//router.all('*',);
export default router;