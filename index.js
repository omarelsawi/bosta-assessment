import { createServer } from "http";
import { Client } from "pg";
const hostname = "127.0.0.1";
const port = 3000;

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

const createBorrowerTableQuery = `
      CREATE TABLE IF NOT EXISTS borrowers (
        id SERIAL PRIMARY KEY,
        name VARCHAR(50) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        registered_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );`;
const createBooksTableQuery = `
      CREATE TABLE IF NOT EXISTS books (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        author VARCHAR(255) NOT NULL,
        quantity INT NOT NULL CHECK (quantity >= 0),
        shelf_location VARCHAR(100)
      );`;
const createBorrowCheckoutsTableQuery = `
    CREATE TABLE IF NOT EXISTS borrow_checkouts (
    id SERIAL PRIMARY KEY,
    borrower_id INTEGER NOT NULL REFERENCES borrowers(id)
      );`;
const createBorrowedBooksTableQuery = `
    CREATE TABLE IF NOT EXISTS borrowed_books (
    checkout_id INTEGER NOT NULL REFERENCES borrow_checkouts(id),
    book_id INTEGER NOT NULL REFERENCES books(id),
    due_date DATE NOT NULL,
    is_returned BOOLEAN NOT NULL DEFAULT FALSE,
    PRIMARY KEY (checkout_id, book_id)
      );`;
await client.query(createBorrowerTableQuery);
await client.query(createBooksTableQuery);
await client.query(createBorrowCheckoutsTableQuery);
await client.query(createBorrowedBooksTableQuery);

const addBorrower = async (name, email) => {
  const query = `
    INSERT INTO borrowers (name, email)
    VALUES ($1, $2)
    RETURNING *;
  `;
  const values = [name, email];

  const res = await client.query(query, values);
  return res.rows[0];
}

const getBorrowers = async () => {
  const query = `SELECT * FROM borrowers;`
  const res = await client.query(query);
  return res.rows;
}
const parseJsonBody = (req) => {
  return new Promise((resolve, reject) => {
    let body = "";
    req.on("data", (chunk) => (body += chunk.toString()));
    req.on("end", () => {
      try {
        resolve(JSON.parse(body));
      } catch (err) {
        reject(err);
      }
    });
    req.on("error", reject);
  });
};

const server = createServer(async (req, res) => {
  if (req.url === "/books") {
    console.log(req.method);
    switch (req.method) {
      case "GET":
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.end("Get Books");
      case "POST":
      case "PUT":
        res.statusCode = 200;
        res.setHeader("Content-Type", "text/plain");
        res.end("Put Book");
      case "DELETE":
        res.statusCode = 200;
        res.setHeader("Content-Type", "text/plain");
        res.end("Delete Book");
    }
  } else if (req.url === "/borrowers") {
    switch (req.method) {
      case "GET":
        res.setHeader("Content-Type", "application/json");
        try{
          const queryResponse = await getBorrowers();
          res.statusCode = 200;
          res.end(JSON.stringify(queryResponse));
        } catch (err) {
          res.statusCode = 400;
          res.end(JSON.stringify({ error: err.message }));
        } finally {break;}
      case "POST":
        res.setHeader("Content-Type", "application/json");
        const body = await parseJsonBody(req);
        try{
          const queryResponse = await addBorrower(body.name, body.email);
          res.statusCode = 200;
          res.end(JSON.stringify(queryResponse));
        } catch (err) {
          res.statusCode = 400;
          res.end(JSON.stringify({ error: err.message }));
        } finally {break;}
      case "PUT":
        res.statusCode = 200;
        res.setHeader("Content-Type", "text/plain");
        res.end("Put Borrower");
      case "DELETE":
        res.statusCode = 200;
        res.setHeader("Content-Type", "text/plain");
        res.end("Delete Borrower");
    }
  } else {
    res.statusCode = 200;
    res.setHeader("Content-Type", "text/plain");
    res.end("Hello World");
  }
});

server.listen(port, hostname, () =>
  console.log(`Server running at http://${hostname}:${port}/`)
);

const shutdown = async (signal) => {
  console.log(`\nReceived ${signal}. Closing PostgreSQL client...`);
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
