import {
  getBooks,
  addBook,
  updateBook,
  deleteBook,
  searchBook,
} from "../controllers/booksController.js";
import {
  checkoutBook,
  getOverdueBooks,
} from "../controllers/borrowerCheckoutController.js";
import parseJsonBody from "../utils/parser.js";

const bookRoutes = async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const urlSegments = req.url.split("/");
  const secondSegment = urlSegments.length > 2 ? urlSegments[2] : null;
  let body = {};
  const searchParams = url.searchParams.get("search");
  res.setHeader("Content-Type", "application/json");

  // Route: /books/:id/checkout
  if (!isNaN(secondSegment) && urlSegments[3] === "checkout") {
    switch (req.method) {
      case "POST":
        try {
          body = await parseJsonBody(req);
          if(!body.borrowerId){
            res.statusCode = 400
            throw new Error('Borrower ID is required')
          }
          if(!body.dueDate){
            res.statusCode = 400
            throw new Error('Due Date is required')
          }
          const queryResponse = await checkoutBook(
            body.borrowerId,
            secondSegment,
            body.dueDate
          );
          res.statusCode = 200;
          res.end(JSON.stringify(queryResponse));
        } catch (err) {
          if(!res.statusCode) res.statusCode = 400;
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
  // Route: /books/overdue
  else if (secondSegment === "overdue") {
    switch (req.method) {
      case "GET":
        try {
          const queryResponse = await getOverdueBooks();
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
  // Route: /books/:id
  else if (!isNaN(secondSegment)) {
    switch (req.method) {
      case "PUT":
        try {
          body = await parseJsonBody(req);
          const queryResponse = await updateBook(secondSegment, body);
          if (!queryResponse) throw new Error("Book not found");
          res.statusCode = 200;
          res.end(JSON.stringify(queryResponse));
        } catch (err) {
          res.statusCode = 400;
          res.end(JSON.stringify({ error: err.message }));
        }
        break;
      case "DELETE":
        try {
          if (isNaN(secondSegment)) throw new Error("ID must be a number");
          const queryResponse = await deleteBook(secondSegment);
          if (!queryResponse) throw new Error("Book not found");
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
  // Route: /books
  else {
    switch (req.method) {
      case "GET":
        if (searchParams) {
          try {
            const queryResponse = await searchBook(searchParams);
            res.statusCode = 200;
            res.end(JSON.stringify(queryResponse));
          } catch (err) {
            res.statusCode = 400;
            res.end(JSON.stringify({ error: err.message }));
          }
        } else {
          try {
            const queryResponse = await getBooks();
            res.statusCode = 200;
            res.end(JSON.stringify(queryResponse));
          } catch (err) {
            res.statusCode = 400;
            res.end(JSON.stringify({ error: err.message }));
          }
        }
        break;
      case "POST":
        try {
          body = await parseJsonBody(req);
          const queryResponse = await addBook(
            body.title,
            body.author,
            body.isbn,
            body.quantity,
            body.shelf_location
          );
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

export default bookRoutes;
