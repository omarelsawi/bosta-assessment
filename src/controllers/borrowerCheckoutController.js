import client from "../config/db.js";

const checkoutBook = async (borrowerId, bookId, dueDate) => {
    const insertQuery = `
      INSERT INTO borrow_checkouts(borrower_id, book_id, due_date)
      VALUES ($1, $2, $3)
      RETURNING *;
      `;
    const values = [borrowerId, bookId, dueDate];

    const updateQuantityQuery = `
      UPDATE books
      SET quantity = quantity - 1
      WHERE id = $1;
      `;

    const res = await client.query(insertQuery, values);
    await client.query(updateQuantityQuery, [bookId]);
    return res.rows[0];
  };

const returnBook = async (checkoutId, borrowerId) => {
  const checkBookReturnedQuery = `
  SELECT is_returned
  FROM borrow_checkouts
  WHERE id = $1 AND borrower_id = $2 AND is_returned = TRUE
  `

  let res = await client.query(checkBookReturnedQuery, [checkoutId,borrowerId]);
  if(res.rows[0]) throw new Error('This book has already been returned');

  const updateQuery = `
  UPDATE borrow_checkouts
  SET is_returned = TRUE
  WHERE id = $1 AND borrower_id = $2
  RETURNING *;
  `
  res = await client.query(updateQuery, [checkoutId, borrowerId]);
  if(!res.rows[0]) throw new Error('This borrw checkout ID does not exist for this borrower');

  const bookId = res.rows[0].bookId;
  const updateQuantityQuery = `
  UPDATE books
  SET quantity = quantity + 1
  WHERE id = $1;
    `;

  await client.query(updateQuantityQuery, [bookId]);

  return res.rows[0];
}

const getOverdueBooks = async () => {
  const query = `
  SELECT * FROM borrow_checkouts
  WHERE is_returned = FALSE AND due_date < CURRENT_TIMESTAMP
  ;
  `
  const res = await client.query(query);
  return res.rows;

}
const getBorrowersBooks = async (borrowerId) => {
  const query =`
  SELECT *
  FROM borrow_checkouts JOIN books
  ON borrow_checkouts.book_id = books.id
  WHERE borrower_id = $1
  `
  const values = [borrowerId]
  const res = await client.query(query, values);
  return res.rows;

}


export {
  checkoutBook,
  returnBook,
  getOverdueBooks,
  getBorrowersBooks
}
