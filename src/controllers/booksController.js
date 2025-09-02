import client from "../config/db.js";

const addBook = async (title, author, isbn, quantity, shelf_location) => {
    const query = `
      INSERT INTO books (title, author, isbn, quantity, shelf_location)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *;
    `;
    const values = [title, author, isbn, quantity, shelf_location];

    const res = await client.query(query, values);
    return res.rows[0];
  }

  const getBooks = async () => {
    const query = `SELECT * FROM books;`
    const res = await client.query(query);
    return res.rows;
  }

  const updateBook = async (id, body) => {
    const query = `
          UPDATE books
          SET title = $1, author = $2, isbn = $3, quantity = $4, shelf_location = $5
          WHERE id = $6
          RETURNING *;
        `;
        const values = [body.title, body.author, body.isbn, body.quantity, body.shelf_location, id];

        const res = await client.query(query, values);
        return res.rows[0];
  }

  const deleteBook = async (id) => {
        const query = `
          DELETE FROM books
          WHERE id = $1
          RETURNING *;
        `;

        const res = await client.query(query, [id]);
        return res.rows[0];
  }

  const searchBook = async (searchTerm) => {
       const query =  `
        SELECT *
        FROM books
        WHERE title ILIKE '%' || $1 || '%'
        OR author ILIKE '%' || $1 || '%'
        OR isbn ILIKE '%' || $1 || '%';
        `

        const res = await client.query(query, [searchTerm]);
        return res.rows;
  }


  export {
    addBook,
    getBooks,
    updateBook,
    deleteBook,
    searchBook
  }
