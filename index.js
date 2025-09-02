import "dotenv/config";
import { createServer } from "http";
import client from "./src/config/db.js";
import createTables from "./src/models/schema.js";
import bookRoutes from "./src/routes/bookRoutes.js";
import borrowerRoutes from "./src/routes/borrowerRoutes.js";

const hostname = "127.0.0.1";
const port = 3000;

(async () => {
    await createTables();
})();


const server = createServer(async (req, res) => {
  if (req.url.startsWith("/books")) {
    await bookRoutes(req, res);
  } else if (req.url.startsWith("/borrowers")) {
    await borrowerRoutes(req, res);
  } else {
    res.statusCode = 200;
    res.setHeader("Content-Type", "text/plain");
    res.end("Home");
  }
});

server.listen(port, hostname, () =>
  console.log(`Server running at http://${hostname}:${port}/`)
);

const shutdown = async (signal) => {
  console.log(`
Received ${signal}. Closing PostgreSQL client...`);
  try {
    await client.end();
    console.log("Client disconnected. Exiting process.");
  } catch (err) {
    console.error("Error disconnecting client", err.stack);
  } finally {
    process.exit(0);
  }
};

// Watch for shutdown signals
process.on("SIGINT", () => shutdown("SIGINT")); // Ctrl+C
process.on("SIGTERM", () => shutdown("SIGTERM")); // System termination
