import cron from 'node-cron';
import Mover from '../schedules/mover.js';

//Pasara los datos cada 3 segundos
cron.schedule('*/3 * * * * *', async () => {
    try {
        await Mover.bridgeToMySQL();     // Oracle -> MySQL
        await Mover.bridgeToOracle();    // MySQL  -> Oracle
        console.debug("⏱️  ciclo bridge OK", new Date().toISOString());
    } catch (error) {
        console.error('Error al ejecutar Mover:', error);
    }
});