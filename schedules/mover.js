import mySqlPool from "../config/dbMySql.js";
import oracleConnection from "../config/dbOracle.js";

/* ---------------- pool Oracle (una sola vez) ---------------- */
const oraclePool = await oracleConnection();

/* ============================================================ *
 * 1) ORACLE  ➜  MySQL   (enviado_api = 0, origen = 'ORACLE')
 * ============================================================ */
async function bridgeToMySQL() {
    const ora = await oraclePool.getConnection();

    /* Traemos hasta 200 filas pendientes */
    const result = await ora.execute(
        `SELECT id_bitacora,
            tabla_afectada,
            tipo_operacion,
            fecha_hora,
            id_registro,
            datos_json
       FROM BITACORA
      WHERE enviado_api = 0
        AND origen = LOWER('oracle')
      ORDER BY fecha_hora
      FETCH FIRST 200 ROWS ONLY`
    );
    //console.log(JSON.stringify(result, null, 2));
    const rows = result.rows;
    //console.debug("Oracle ➜ MySQL  filas pendientes:", rows.length);
    if (!rows.length) { await ora.close(); return; }

    const my = await mySqlPool.getConnection();

    try {
        
        for (const r of rows) {
            try {
                await my.execute(
                    `INSERT INTO bitacora
             (tabla_afectada, tipo_operacion, fecha_hora,
              id_registro, datos_json, replicado, origen, enviado_api)
           VALUES (?,?,?,?,?,0,'oracle',0)`,
                    [
                        r.TABLA_AFECTADA,
                        r.TIPO_OPERACION,
                        r.FECHA_HORA,
                        r.ID_REGISTRO,
                        r.DATOS_JSON
                    ]
                );

                console.log("Insert MySQL OK, new id:", result.insertId);

                /* marcar como enviado en Oracle */
                await ora.execute(
                    `UPDATE bitacora
                    SET enviado_api = 1
                    WHERE id_bitacora = :id`,
                    [r.ID_BITACORA]
                );
            } catch (insErr) {
                console.error("❌ ORA➜MY fallo fila", r.ID_BITACORA, insErr);
                /* NO marcamos enviado_api — quedará para reintento */
            }
        }
        await ora.commit();   // confirmar marcados en Oracle
    }
    finally {
        my.release();
        await ora.close();
    }
}

/* ============================================================ *
 * 2) MySQL  ➜  ORACLE   (enviado_api = 0, origen = 'MYSQL')
 * ============================================================ */
async function bridgeToOracle() {
    const my = await mySqlPool.getConnection();
    const [rows] = await my.query(
        `SELECT id_bitacora,
            tabla_afectada,
            tipo_operacion,
            fecha_hora,
            id_registro,
            datos_json
       FROM bitacora
      WHERE enviado_api = 0
        AND origen       = 'mysql'
      ORDER BY fecha_hora
      LIMIT 200`
    );
    if (!rows.length) { my.release(); return; }

    const ora = await oraclePool.getConnection();

    try {
        for (const r of rows) {
            const datosStr =
                typeof r.datos_json === "string"
                    ? r.datos_json
                    : JSON.stringify(r.datos_json);

            await ora.execute(
                `INSERT INTO bitacora
                    (id_bitacora,  tabla_afectada, tipo_operacion, fecha_hora,
                        id_registro,  datos_json,   replicado, enviado_api, origen)
                VALUES (seq_bitacora.NEXTVAL, :TABLA, :OP, :FECHA,
                        :ID_REGISTRO, :DATOS_JSON, 0, 0, 'mysql')`,
                {
                    TABLA: r.tabla_afectada,
                    OP: r.tipo_operacion,
                    FECHA: r.fecha_hora,
                    ID_REGISTRO: r.id_registro,
                    DATOS_JSON: { val: datosStr, type: ora.STRING, maxSize: 4000 }
                }
            );

            /* Marcamos enviado_api = 1 en MySQL */
            await my.execute(
                `UPDATE bitacora
            SET enviado_api = 1
          WHERE id_bitacora = ?`,
                [r.id_bitacora]
            );
        }
        await ora.commit();   // confirmar inserciones en Oracle
    } finally {
        await ora.close();
        my.release();
    }
}

/* ============================================================ *
 * Exportamos la clase envolviendo los dos métodos
 * ============================================================ */
class Mover {
    static async bridgeToMySQL() { return bridgeToMySQL(); }
    static async bridgeToOracle() { return bridgeToOracle(); }
}

export default Mover;
