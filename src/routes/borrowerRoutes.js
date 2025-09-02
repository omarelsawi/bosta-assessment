import {
  getBorrowers,
  addBorrower,
  updateBorrower,
  deleteBorrower,
} from "../controllers/borrowersController.js";
import {
  returnBook,
  getBorrowersBooks,
} from "../controllers/borrowerCheckoutController.js";
import parseJsonBody from "../utils/parser.js";

const borrowerRoutes = async (req, res) => {
  const urlSegments = req.url.split("/");
  const id = urlSegments.length > 2 ? urlSegments[2] : null;
  let body = {};
  res.setHeader("Content-Type", "application/json");

  // Route: /borrowers/:id/listBooks
  if (id && urlSegments[3] === "listBooks") {
    switch (req.method) {
      case "GET":
        try {
          if (isNaN(id)) throw new Error("ID must be a number");
          const queryResponse = await getBorrowersBooks(id);
          res.statusCode = 200;
          res.end(JSON.stringify(queryResponse));
        } catch (err) {
          res.statusCode = 400;
          res.end(JSON.stringify({ error: err.message }));
        }
        break;
      default:
        res.statusCode = 405;
        res.end(
          JSON.stringify({
            error: `Method ${req.method} not allowed for this route`,
          })
        );
        break;
    }
  }
  // Route: /borrowers/:id/return
  else if (id && urlSegments[3] === "return") {
    switch (req.method) {
      case "POST":
        try {
          if (isNaN(id)) throw new Error("ID must be a number");
          body = await parseJsonBody(req);
          if (!body.checkoutId) throw new Error("CheckoutId is required");
          const queryResponse = await returnBook(body.checkoutId, id);
          if (!queryResponse) throw new Error("This checkout ID doesn't exist");
          res.statusCode = 200;
          res.end(JSON.stringify(queryResponse));
        } catch (err) {
          res.statusCode = 400;
          res.end(JSON.stringify({ error: err.message }));
        }
        break;
      default:
        res.statusCode = 405;
        res.end(
          JSON.stringify({
            error: `Method ${req.method} not allowed for this route`,
          })
        );
        break;
    }
  }
  // Route: /borrowers/:id
  else if (id) {
    switch (req.method) {
      case "PUT":
        try {
          if (isNaN(id)) throw new Error("Id must be a number");
          body = await parseJsonBody(req);
          const queryResponse = await updateBorrower(id, body);
          if (!queryResponse) throw new Error("Borrower not found");
          res.statusCode = 200;
          res.end(JSON.stringify(queryResponse));
        } catch (err) {
          res.statusCode = 400;
          res.end(JSON.stringify({ error: err.message }));
        }
        break;
      case "DELETE":
        try {
          if (isNaN(id)) throw new Error("Id must be a number");
          const queryResponse = await deleteBorrower(id);
          if (!queryResponse) throw new Error("Borrower not found");
          res.statusCode = 200;
          res.end(JSON.stringify(queryResponse));
        } catch (err) {
          res.statusCode = 400;
          res.end(JSON.stringify({ error: err.message }));
        }
        break;
      default:
        res.statusCode = 405;
        res.end(
          JSON.stringify({
            error: `Method ${req.method} not allowed for this route`,
          })
        );
        break;
    }
  }
  // Route: /borrowers
  else {
    switch (req.method) {
      case "GET":
        try {
          const queryResponse = await getBorrowers();
          res.statusCode = 200;
          res.end(JSON.stringify(queryResponse));
        } catch (err) {
          res.statusCode = 400;
          res.end(JSON.stringify({ error: err.message }));
        }
        break;
      case "POST":
        try {
          body = await parseJsonBody(req);
          const queryResponse = await addBorrower(body.name, body.email);
          res.statusCode = 200;
          res.end(JSON.stringify(queryResponse));
        } catch (err) {
          res.statusCode = 400;
          res.end(JSON.stringify({ error: err.message }));
        }
        break;
      default:
        res.statusCode = 405;
        res.end(
          JSON.stringify({
            error: `Method ${req.method} not allowed for this route`,
          })
        );
        break;
    }
  }
};

export default borrowerRoutes;
