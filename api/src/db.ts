import { Pool } from "pg";
import { userEnv } from "./user-env";

export const pool = new Pool({
  connectionString: userEnv("DATABASE_URL"),
  ssl: { rejectUnauthorized: false },
});