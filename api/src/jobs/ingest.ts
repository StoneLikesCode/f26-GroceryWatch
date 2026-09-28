import "dotenv/config";
import { pool } from "../db";

async function main() {
  try {
    await pool.query("INSERT INTO ingest_runs (status) VALUES ('ok')");
    console.log("Ingest run recorded");
  } catch (err) {
    console.error("Ingest failed", err);
    process.exitCode = 1;
  } finally {
    await pool.end();
  }
}

main();