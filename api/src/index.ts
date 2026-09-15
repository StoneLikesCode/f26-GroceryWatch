import "dotenv/config";
import Fastify from "fastify";
import cors from "@fastify/cors";
import { pool } from "./db";

const app = Fastify({ logger: true });
app.register(cors);

app.get("/health", async (_req, reply) => {
  try {
    await pool.query("SELECT 1");
    return { status: "ok", db: "connected" };
       } catch (err) {
    app.log.error(err);
    return reply.code(500).send({ status: "error", db: "unreachable" });
  }
});

const port = Number(process.env.PORT) || 3000;
//Listening on 0.0.0.0 matters twice: Railway needs it, and so does your phone when it hits your laptop over Wi-Fi. -SC
app.listen({ port, host: "0.0.0.0" });