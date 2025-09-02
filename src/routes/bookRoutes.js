import {
  getBooks,
  addBook,
  updateBook,
  deleteBook,
  searchBook,
} from "../controllers/booksController.js";
import {
  checkoutBook,
  getOverdueBooks
} from "../controllers/borrowerCheckoutController.js";
import parseJsonBody from "../utils/parser.js";

const bookRoutes = async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const urlSegments = req.url.split("/");
  const id = urlSegments.length > 2 ? urlSegments[2] : null;
  let body = {};
  const searchParams = url.searchParams.get("search");
  switch (req.method) {
    case "GET":
      res.setHeader("Content-Type", "application/json");
      if (urlSegments[2] === 'overdue'){
        try {
          const queryResponse = await getOverdueBooks();
          res.statusCode = 200;
          res.end(JSON.stringify(queryResponse));
        } catch (err) {
          res.statusCode = 400;
          res.end(JSON.stringify({ error: err.message }));
        } finally {
          break;
        }
      } else if (!searchParams) {
        try {
          const queryResponse = await getBooks();
          res.statusCode = 200;
          res.end(JSON.stringify(queryResponse));
        } catch (err) {
          res.statusCode = 400;
          res.end(JSON.stringify({ error: err.message }));
        } finally {
          break;
        }
      } else {
        try {
          const queryResponse = await searchBook(searchParams);
          res.statusCode = 200;
          res.end(JSON.stringify(queryResponse));
        } catch (err) {
          res.statusCode = 400;
          res.end(JSON.stringify({ error: err.message }));
        } finally {
          break;
        }
      }
    case "POST":
      res.setHeader("Content-Type", "application/json");
      console.log(urlSegments);
      if (urlSegments[3] === "checkout") {
        try {
          body = await parseJsonBody(req);
          const queryResponse = await checkoutBook(body.borrowerId, id, body.dueDate);
          res.statusCode = 200;
          res.end(JSON.stringify(queryResponse));
        } catch (err) {
          res.statusCode = 400;
          res.end(JSON.stringify({ error: err.message }));
        } finally {
          break;
        }
      } else {
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
        } finally {
          break;
        }
      }
    case "PUT":
      res.setHeader("Content-Type", "application/json");
      try {
        if (!id) throw new Error("ID needs to be specified");
        if (isNaN(id)) throw new Error("ID must be a number");
        body = await parseJsonBody(req);
        const queryResponse = await updateBook(id, body);
        if (!queryResponse) throw new Error("Book not found");
        res.statusCode = 200;
        res.end(JSON.stringify(queryResponse));
      } catch (err) {
        res.statusCode = 400;
        res.end(JSON.stringify({ error: err.message }));
      } finally {
        break;
      }
    case "DELETE":
      res.setHeader("Content-Type", "application/json");
      try {
        if (!id) throw new Error("ID needs to be specified");
        if (isNaN(id)) throw new Error("ID must be a number");
        const queryResponse = await deleteBook(id);
        if (!queryResponse) throw new Error("Book not found");
        res.statusCode = 200;
        res.end(JSON.stringify(queryResponse));
      } catch (err) {
        res.statusCode = 400;
        res.end(JSON.stringify({ error: err.message }));
      } finally {
        break;
      }
  }
};

export default bookRoutes;
