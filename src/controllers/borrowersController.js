import client from "../config/db.js";

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
