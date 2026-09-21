import "dotenv/config";
import { pool } from "../db";

// this is a place holder job. We will later fill with Open Food Facts and Kroger pulls. For now, it just records a successful ingest run in the database.
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