import client from "../config/db.js";

const checkoutBook = async (borrowerId, bookId) => {
    const query = `
      INSERT INTO borrow_checkouts(borrowerId, author, isbn, quantity, shelf_location)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *;
    `;
    const values = [title, author, isbn, quantity, shelf_location];

    const res = await client.query(query, values);
    return res.rows[0];
  }

  export {
    checkoutBook
}
