import mySqlPool      from "./config/dbMySql.js";
import oracleConnection from "./config/dbOracle.js";

(async () => {
  try {
    // MySQL
    const myConn = await mySqlPool.getConnection();
    const [rows] = await myConn.query("SELECT NOW() AS fecha_mysql");
    console.log("MySQL OK →", rows[0]);
    myConn.release();

    // Oracle
    const oraclePool = await oracleConnection();  
    const oraConn = await oraclePool.getConnection();
    const result     = await oraConn.execute(
      `SELECT TO_CHAR(SYSDATE,'YYYY-MM-DD HH24:MI:SS') AS fecha_oracle FROM dual`
    );
    console.log("Oracle OK →", result.rows[0]);
    await oraConn.close();

    console.log("Conexiones correctas ✔️");
    process.exit(0);
  } catch (e) {
    console.error("Error en conexión:", e);
    process.exit(1);
  }
})();
