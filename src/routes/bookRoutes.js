const bookRoutes = async (req, res) => {
    console.log(req.method);
    switch (req.method) {
      case "GET":
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.end("Get Books");
      case "POST":
      case "PUT":
        res.statusCode = 200;
        res.setHeader("Content-Type", "text/plain");
        res.end("Put Book");
      case "DELETE":
        res.statusCode = 200;
        res.setHeader("Content-Type", "text/plain");
        res.end("Delete Book");
    }
}

export default bookRoutes;