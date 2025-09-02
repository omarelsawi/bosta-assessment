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
  const url = new URL(req.url, `http://${req.headers.host}`);
  const { pathname } = url;
  const pathSegments = pathname.split("/").filter(Boolean);

  res.setHeader("Content-Type", "application/json");
  let body = {};

  // Route: /borrowers/:id/listBooks
  if (
    pathSegments.length === 3 &&
    pathSegments[0] === "borrowers" &&
    !isNaN(pathSegments[1]) &&
    pathSegments[2] === "listBooks"
  ) {
    const id = pathSegments[1];
    switch (req.method) {
      case "GET":
        try {
          const queryResponse = await getBorrowersBooks(id);
          if (!queryResponse) {
            res.statusCode = 404;
            throw new Error("Borrower not found");
          }
          res.statusCode = 200;
          res.end(JSON.stringify(queryResponse));
        } catch (err) {
          res.statusCode = res.statusCode || 400;
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
  else if (
    pathSegments.length === 3 &&
    pathSegments[0] === "borrowers" &&
    !isNaN(pathSegments[1]) &&
    pathSegments[2] === "return"
  ) {
    const id = pathSegments[1];
    switch (req.method) {
      case "POST":
        try {
          body = await parseJsonBody(req);
          if (!body.checkoutId) {
            res.statusCode = 400;
            throw new Error("CheckoutId is required");
          }
          const queryResponse = await returnBook(body.checkoutId, id);
          if (!queryResponse) {
            res.statusCode = 404;
            throw new Error("Checkout record not found for this borrower.");
          }
          res.statusCode = 200;
          res.end(JSON.stringify(queryResponse));
        } catch (err) {
          res.statusCode = res.statusCode || 400;
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
  else if (
    pathSegments.length === 2 &&
    pathSegments[0] === "borrowers" &&
    !isNaN(pathSegments[1])
  ) {
    const id = pathSegments[1];
    switch (req.method) {
      case "PUT":
        try {
          body = await parseJsonBody(req);
          const queryResponse = await updateBorrower(id, body);
          if (!queryResponse) {
            res.statusCode = 404;
            throw new Error("Borrower not found");
          }
          res.statusCode = 200;
          res.end(JSON.stringify(queryResponse));
        } catch (err) {
          res.statusCode = res.statusCode || 400;
          res.end(JSON.stringify({ error: err.message }));
        }
        break;
      case "DELETE":
        try {
          const queryResponse = await deleteBorrower(id);
          if (!queryResponse) {
            res.statusCode = 404;
            throw new Error("Borrower not found");
          }
          res.statusCode = 200;
          res.end(JSON.stringify({ message: "Borrower deleted successfully" }));
        } catch (err) {
          res.statusCode = res.statusCode || 400;
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
  else if (pathSegments.length === 1 && pathSegments[0] === "borrowers") {
    switch (req.method) {
      case "GET":
        try {
          const queryResponse = await getBorrowers();
          res.statusCode = 200;
          res.end(JSON.stringify(queryResponse));
        } catch (err) {
          res.statusCode = 500;
          res.end(JSON.stringify({ error: "Internal Server Error" }));
        }
        break;
      case "POST":
        try {
          body = await parseJsonBody(req);
          const { name, email } = body;
          if (!name || !email) {
            res.statusCode = 400;
            throw new Error("Missing required fields: name, email");
          }
          const queryResponse = await addBorrower(name, email);
          res.statusCode = 201;
          res.end(JSON.stringify(queryResponse));
        } catch (err) {
          res.statusCode = res.statusCode || 400;
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
  } else {
    res.statusCode = 404;
    res.end(JSON.stringify({ error: "Not Found" }));
  }
};

export default borrowerRoutes;
