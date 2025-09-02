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
  const { pathname } = url;
  const searchParams = url.searchParams.get("search");
  const pathSegments = pathname.split("/").filter(Boolean); // e.g., /books/123 -> ['books', '123']

  res.setHeader("Content-Type", "application/json");
  let body = {};

  // Route: /books/:id/checkout
  if (
    pathSegments.length === 3 &&
    pathSegments[0] === "books" &&
    !isNaN(pathSegments[1]) &&
    pathSegments[2] === "checkout"
  ) {
    const id = pathSegments[1];
    switch (req.method) {
      case "POST":
        try {
          body = await parseJsonBody(req);
          if (!body.borrowerId) {
            res.statusCode = 400;
            throw new Error("Borrower ID is required");
          }
          if (!body.dueDate) {
            res.statusCode = 400;
            throw new Error("Due Date is required");
          }
          const queryResponse = await checkoutBook(
            body.borrowerId,
            id,
            body.dueDate
          );
          if (!queryResponse) {
            res.statusCode = 404;
            throw new Error("Book or Borrower not found, or book is unavailable.");
          }
          res.statusCode = 200;
          res.end(JSON.stringify(queryResponse));
        } catch (err) {
          if (err.message === "new row for relation \"borrow_checkouts\" violates check constraint \"borrow_checkouts_check\""){
            err.message = "Due date must be after checkout date"
          } else if (err.message === "insert or update on table \"borrow_checkouts\" violates foreign key constraint \"borrow_checkouts_book_id_fkey\""){
            err.message = "This book does not exist"
          } else if (err.message === "insert or update on table \"borrow_checkouts\" violates foreign key constraint \"borrow_checkouts_borrower_id_fkey\""){
            err.message = "This borrower does not exist"
          } else if (err.message === "new row for relation \"books\" violates check constraint \"books_quantity_check\""){
            err.message = "There are no remaining copies of this book"
          }
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
  // Route: /books/overdue
  else if (
    pathSegments.length === 2 &&
    pathSegments[0] === "books" &&
    pathSegments[1] === "overdue"
  ) {
    switch (req.method) {
      case "GET":
        try {
          const queryResponse = await getOverdueBooks();
          res.statusCode = 200;
          res.end(JSON.stringify(queryResponse));
        } catch (err) {
          res.statusCode = 500;
          res.end(JSON.stringify({ error: "Internal Server Error" }));
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
  else if (
    pathSegments.length === 2 &&
    pathSegments[0] === "books" &&
    !isNaN(pathSegments[1])
  ) {
    const id = pathSegments[1];
    switch (req.method) {
      case "PUT":
        try {
          body = await parseJsonBody(req);
          const queryResponse = await updateBook(id, body);
          if (!queryResponse) {
            res.statusCode = 404;
            throw new Error("Book not found");
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
          const queryResponse = await deleteBook(id);
          if (!queryResponse) {
            res.statusCode = 404;
            throw new Error("Book not found");
          }
          res.statusCode = 200;
          res.end(JSON.stringify({ message: "Book deleted successfully" }));
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
  // Route: /books
  else if (pathSegments.length === 1 && pathSegments[0] === "books") {
    switch (req.method) {
      case "GET":
        try {
          let queryResponse;
          if (searchParams) {
            queryResponse = await searchBook(searchParams);
          } else {
            queryResponse = await getBooks();
          }
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
          const { title, author, isbn, quantity, shelf_location } = body;
          if (!title || !author || !isbn || quantity === undefined || !shelf_location) {
            res.statusCode = 400;
            throw new Error(
              "The following fields are required: title, author, isbn, quantity, shelf_location"
            );
          }
          const queryResponse = await addBook(
            title,
            author,
            isbn,
            quantity,
            shelf_location
          );
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

export default bookRoutes;
