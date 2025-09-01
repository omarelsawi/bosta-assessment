import client from "../config/db.js";

const addBook = async (title, author, quantity, shelf_location) => {
    const query = `
      INSERT INTO books (title, author, quantity, shelf_location)
      VALUES ($1, $2, $3, $4)
      RETURNING *;
    `;
    const values = [title, author, quantity, shelf_location];

    const res = await client.query(query, values);
    return res.rows[0];
  }

  const getBooks = async () => {
    const query = `SELECT * FROM borrowers;`
    const res = await client.query(query);
    return res.rows;
  }

  const updateBorrower = async (id, body) => {
    const query = `
          UPDATE borrowers
          SET name = $1, email = $2
          WHERE id = $3
          RETURNING *;
        `;
        const values = [body.name, body.email, id];

        const res = await client.query(query, values);
        return res.rows[0];
  }

  const deleteBorrower = async (id) => {
        const query = `
          DELETE FROM borrowers
          WHERE id = $1
          RETURNING *;
        `;

        const res = await client.query(query, [id]);
        return res.rows[0];
  }

  export {
    addBorrower,
    getBorrowers,
    updateBorrower,
    deleteBorrower
  }
