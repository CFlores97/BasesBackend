import OracleDB from "oracledb";
OracleDB.fetchAsString = [ OracleDB.CLOB ];
import dotenv from 'dotenv'

dotenv.config();

//formato de salida como objeto
OracleDB.outFormat = OracleDB.OUT_FORMAT_OBJECT;

//desactivar autocommits
OracleDB.autoCommit = false;

const oracleConnection = async () => {
    try {
        const oraclePool = await OracleDB.createPool({
            user: process.env.ORACLE_USER,
            password: process.env.ORACLE_PASS,
            connectString: process.env.ORACLE_CONNECT,
            poolMin: 1,
            poolMax: 10, 
            poolIncrement: 1
        });
        return oraclePool
    } catch (e) {
        console.error('Error al conectar a Oracle: ',e);
    }

};

export default oracleConnection;