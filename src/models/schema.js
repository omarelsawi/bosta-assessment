import client from "../config/db.js";

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
        isbn VARCHAR(255) NOT NULL,
        quantity INT NOT NULL CHECK (quantity >= 0),
        shelf_location VARCHAR(100)
      );`;
const createBorrowCheckoutsTableQuery = `
    CREATE TABLE IF NOT EXISTS borrow_checkouts (
    id SERIAL PRIMARY KEY,
    borrower_id INTEGER NOT NULL REFERENCES borrowers(id),
    book_id INTEGER NOT NULL REFERENCES books(id),
    checkout_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    due_date TIMESTAMP NOT NULL CHECK (due_date > checkout_date),
    is_returned BOOLEAN NOT NULL DEFAULT FALSE
      );`;

const createTables = async () => {
    await client.query(createBorrowerTableQuery);
    await client.query(createBooksTableQuery);
    await client.query(createBorrowCheckoutsTableQuery);
}

export default createTables;