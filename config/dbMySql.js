import mysql from 'mysql2/promise'
import dotenv from 'dotenv'

dotenv.config();

// usamos una pool en lugar de una conexion porque es mas eficiente. Permite reutilizar conexiones, maneja fallos automaticos y es ideal para express
const mySqlPool = mysql.createPool({
    host: process.env.MYSQL_HOST,
    port: process.env.MYSQL_PORT,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASS,
    database: process.env.MYSQL_DB,
    waitForConnections: true
});

export default mySqlPool;