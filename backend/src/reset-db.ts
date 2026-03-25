import fs from "fs";
import path from "path";

const dbPath = path.resolve(__dirname, "../../database.sqlite");

if (fs.existsSync(dbPath)) {
  fs.unlinkSync(dbPath);
  console.log("Banco de dados apagado com sucesso.");
} else {
  console.log("Nenhum banco encontrado em:", dbPath);
}
