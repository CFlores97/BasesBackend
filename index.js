import express from 'express'
import dotenv from 'dotenv'
import './Poller/poller.js'
dotenv.config();

import apiRoutes from './routes/apiRoutes.js'

const app = express();

//app.use(express.json());

app.use('/api', apiRoutes);

const PORT = process.env.PORT || 3000; 

app.listen(PORT, () => {
    console.log(`Escuchando en puerto http://localhost:${PORT}`);
    console.log("Node-bridge con cron activo");
});

