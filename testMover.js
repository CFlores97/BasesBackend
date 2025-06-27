/* testMover.js  –  prueba unitaria del puente                               */
/* Ejecuta:  node testMover.js                                               */

import Mover from "./schedules/mover.js";   // <-- ruta donde guardaste mover.js

async function main() {
  try {
    /* Oracle ➜ MySQL */
    await Mover.bridgeToMySQL();
    console.log("✔️  Oracle ➜ MySQL OK");

    /* MySQL ➜ Oracle */
    await Mover.bridgeToOracle();
    console.log("✔️  MySQL ➜ Oracle OK");

    process.exit(0);
  } catch (err) {
    console.error("❌  Error en mover:", err);
    process.exit(1);
  }
}

main();
