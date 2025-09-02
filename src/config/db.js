import { Client } from "pg";

const client = new Client({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

(async () => {
  try {
    await client.connect();
    const res = await client.query("SELECT NOW()");
    console.log("Database connected:", res.rows[0].now);
  } catch (err) {
    console.error("Connection error:", err);
  }
})();

export default client;
