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

const createTables = async () => {
    await client.query(createBorrowerTableQuery);
    await client.query(createBooksTableQuery);
    await client.query(createBorrowCheckoutsTableQuery);
    await client.query(createBorrowedBooksTableQuery);
}

export default createTables;