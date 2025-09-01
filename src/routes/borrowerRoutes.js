import { getBorrowers, addBorrower, updateBorrower, deleteBorrower } from "../controllers/borrowersController.js";
import parseJsonBody from "../utils/parser.js";

const borrowerRoutes = async (req, res) => {
    const urlSegments = req.url.split("/");
    const id = urlSegments.length > 2 ? urlSegments[2] : null;
    let body = {};
    switch (req.method) {
      case "GET":
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
        res.setHeader("Content-Type", "application/json");
        try{
          body = await parseJsonBody(req);
          const queryResponse = await addBorrower(body.name, body.email);
          res.statusCode = 200;
          res.end(JSON.stringify(queryResponse));
        } catch (err) {
          res.statusCode = 400;
          res.end(JSON.stringify({ error: err.message }));
        } finally {break;}
      case "PUT":
        res.setHeader("Content-Type", "application/json");
        try{
          if(!id) throw new Error('Id needs to be specified');
          if(isNaN(id)) throw new Error('Id must be a number');
          body = await parseJsonBody(req);
          const queryResponse = await updateBorrower(id, body);
          if (!queryResponse) throw new Error('Borrower not found');
          res.statusCode = 200;
          res.end(JSON.stringify(queryResponse));
        } catch (err) {
          res.statusCode = 400;
          res.end(JSON.stringify({ error: err.message }));
        } finally {break;}
      case "DELETE":
        res.setHeader("Content-Type", "application/json");
        try{
          if(!id) throw new Error('Id needs to be specified');
          if(isNaN(id)) throw new Error('Id must be a number');
          const queryResponse = await deleteBorrower(id);
          if (!queryResponse) throw new Error('Borrower not found');
          res.statusCode = 200;
          res.end(JSON.stringify(queryResponse));
        } catch (err) {
          res.statusCode = 400;
          res.end(JSON.stringify({ error: err.message }));
        } finally {break;}
    }
}

export default borrowerRoutes;