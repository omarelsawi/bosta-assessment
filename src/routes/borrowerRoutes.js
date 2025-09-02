import {
  getBorrowers,
  addBorrower,
  updateBorrower,
  deleteBorrower,
} from "../controllers/borrowersController.js";
import {
  returnBook,
  getBorrowersBooks
} from "../controllers/borrowerCheckoutController.js";
import parseJsonBody from "../utils/parser.js";

const borrowerRoutes = async (req, res) => {
  const urlSegments = req.url.split("/");
  const id = urlSegments.length > 2 ? urlSegments[2] : null;
  let body = {};
  switch (req.method) {
    case "GET":
      if (!isNaN(id)) {
        if (urlSegments[3] === "listBooks") {
          res.setHeader("Content-Type", "application/json");
          try {
            const queryResponse = await getBorrowersBooks(id);
            res.statusCode = 200;
            res.end(JSON.stringify(queryResponse));
          } catch (err) {
            res.statusCode = 400;
            res.end(JSON.stringify({ error: err.message }));
          } finally {
            break;
          }
        }
      }
      res.setHeader("Content-Type", "application/json");
      try{
        const queryResponse = await getBorrowers();
        res.statusCode = 200;
        res.end(JSON.stringify(queryResponse));
      } catch (err) {
        res.statusCode = 400;
        res.end(JSON.stringify({ error: err.message }));
      } finally {break;}

    case "POST":
        if (urlSegments[3] === "return") {
          try {
            body = await parseJsonBody(req);
            if (!body.checkoutId) throw new Error("CheckoutId is required");
            const queryResponse = await returnBook(body.checkoutId, id);
            if (!queryResponse)
              throw new Error("This checkout ID doesn't exist");
            res.statusCode = 200;
            res.end(JSON.stringify(queryResponse));
          } catch (err) {
            console.log(err.statusCode);
            res.statusCode = 400;
            res.end(JSON.stringify({ error: err.message }));
          } finally {
            break;
          }
        }
      res.setHeader("Content-Type", "application/json");
      try {
        body = await parseJsonBody(req);
        const queryResponse = await addBorrower(body.name, body.email);
        res.statusCode = 200;
        res.end(JSON.stringify(queryResponse));
      } catch (err) {
        res.statusCode = 400;
        res.end(JSON.stringify({ error: err.message }));
      } finally {
        break;
      }
    case "PUT":
      res.setHeader("Content-Type", "application/json");
      try {
        if (!id) throw new Error("Id needs to be specified");
        if (isNaN(id)) throw new Error("Id must be a number");
        body = await parseJsonBody(req);
        const queryResponse = await updateBorrower(id, body);
        if (!queryResponse) throw new Error("Borrower not found");
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
        if (!id) throw new Error("Id needs to be specified");
        if (isNaN(id)) throw new Error("Id must be a number");
        const queryResponse = await deleteBorrower(id);
        if (!queryResponse) throw new Error("Borrower not found");
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

export default borrowerRoutes;
