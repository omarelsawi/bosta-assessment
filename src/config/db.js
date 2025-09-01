import { Client } from "pg";

const client = new Client({
  user: "postgres",
  host: "localhost",
  database: "bosta_assessment",
  password: "123456",
  port: 5432,
});

(async () => {
  try {
    await client.connect();
    const res = await client.query("SELECT NOW()");
    console.log(res.rows[0].now);
  } catch (err) {
    console.error("Connection error:", err);
  }
})();

export default client;