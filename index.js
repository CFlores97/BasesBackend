import express from 'express'
import dotenv from 'dotenv'
import replicationRoutes from './routes/replicationRoutes.js'

const app = express();

app.use(express.json());

app.use('/api', replicationRoutes);

const PORT = process.env.PORT || 3000; 

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

