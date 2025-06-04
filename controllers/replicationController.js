import mySqlPool from "../config/dbMySql";
import oracleConnection from "../config/dbOracle";

class replicationController {
    async estadoConexiones(req, res) {
        // Este metodo se encargara de verificar las conexiones de ambas bases, tanto de mysql y oracle
        res.json({
            mysql: true,
            oracle: true
        });
    }

    async verBitacora(req, res) {
        // Este metodo se encargara de leer la bitacora de una base y la devolvera
        res.json([]);
    }

    async replicar(req, res) {
        // Este metodo se encargara de ejecutar la replicacion bidireccional
        res.json({status: 'OK'});
    }
}

export default replicationController;