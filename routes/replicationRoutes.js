import express from 'express'
import replicationController from '../controllers/replicationController.js'

const router = express.Router();

router.get('/estado', replicationController.estadoConexiones);
router.get('/bitacora', replicationController.verBitacora);
router.get('/replicar', replicationController.replicar);

export default router;