import OracleDB from "oracledb";

const oracleConnection = async () => {
    try {
        const connection = await OracleDB.getConnection({
            user: process.env.ORACLE_USER,
            password: process.env.ORACLE_PASS,
            connectString: process.env.ORACLE_CONNECT
        });
        return connection
    } catch (e) {
        console.error('Error al conectar a Oracle: ',e);
    }

};

export default oracleConnection;