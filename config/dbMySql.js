import mysql from 'mysql2/promise'

// usamos una pool en lugar de una conexion porque es mas eficiente. Permite reutilizar conexiones, maneja fallos automaticos y es ideal para express
const mySqlPool = mysql.createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASS,
    database: process.env.MYSQL_DB
});

export default mySqlPool;