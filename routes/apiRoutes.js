import express from 'express';
import ADminController from '../controllers/adminController.js';


const router = express.Router();

//endpoints para frontend
router.get('/visual/:db/:table', ADminController.listTable);
router.post('/job/:db', ADminController.replicacionManual);


export default router;