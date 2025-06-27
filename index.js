import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors';
import './Poller/poller.js'
dotenv.config();

import apiRoutes from './routes/apiRoutes.js'

const app = express();

// permite peticiones desde el front
app.use(cors());    

// parsea body JSON en req.body          
app.use(express.json());

//endpoint de salud
app.get("/health", (_, res) => res.json({ ok: true }));

app.use('/api', apiRoutes);

const PORT = process.env.PORT || 3000; 

app.listen(PORT, () => {
    console.log(`Escuchando en puerto http://localhost:${PORT}`);
    console.log("Node-bridge con cron activo");
});

