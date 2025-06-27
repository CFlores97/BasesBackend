import mySqlPool from "../config/dbMySql.js";
import oracleConnection from "../config/dbOracle.js";

const oraclePoolPromise = await oracleConnection();

class ADminController {
    static async listTable(req, res) {
        // ej. db=oracle table=paciente
        //Para listar las tablas, osea visualizacion
        const { db, table } = req.params;
        try {

            //oracle
            if (db === "oracle") {
                //Espera a que el pool ya esté creado 
                const oraclePool = await oraclePoolPromise;
                const oraConn = await oraclePool.getConnection();


                const result = await oraConn.execute(
                    `SELECT * FROM ${table} FETCH FIRST 100 ROWS ONLY`
                );
                await oraConn.close();
                return res.json(result.rows);
            }

            //mysql
            if (db === "mysql") {
                const myConn = await mySqlPool.getConnection();
                const [rows] = await myConn.query(`SELECT * FROM ${table} LIMIT 100`);
                myConn.release();
                return res.json(rows);
            }


            return res.status(400).json({ error: "db debe ser oracle o mysql" });

        } catch (e) {
            console.error("listTable error:", e);
            return res.status(500).json({ error: e.message });
        }
    }

    // para el boton de replicacion manual
    static async replicacionManual(req, res) {
        const { db } = req.params;
        try {
            if (db === "oracle") {
                const oraclePool = await oraclePoolPromise;
                const oraConn = await oraclePool.getConnection();
                await oraConn.execute(`BEGIN DBMS_SCHEDULER.run_job('JOB_REPLICAR_BITACORA_ORA'); END;`);
                await oraConn.close();
                return res.json({ ok: true, msg: "Job Oracle lanzado" });
            }

            if (db === "mysql") {
                const myConn = await mySqlPool.getConnection();
                await myConn.query(`CALL replicar_bitacora_mysql();`);
                myConn.release();
                return res.json({ ok: true, msg: "Job MySQL lanzado" });
            }

            return res.status(400).json({ error: "db debe ser oracle o mysql" });

        } catch (e) {
            console.error("replicacionManual error:", e);
            return res.status(500).json({ error: e.message });
        }
    }
}

export default ADminController;