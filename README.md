# Library Management System

This is a simple library management system API built with Node.js.

## Prerequisites

Before you begin, ensure you have the following installed:

*   **Node.js**: [Download and install Node.js](https://nodejs.org/)
*   **PostgreSQL**: [Download and install PostgreSQL](https://www.postgresql.org/download/)
*   **pgAdmin**: [Download and install pgAdmin](https://www.pgadmin.org/download/)

## Database Setup

1.  **Start PostgreSQL**: Ensure your PostgreSQL server is running.
2.  **Connect with pgAdmin**:
    *   Open pgAdmin.
    *   Right-click on "Servers" and select "Register" > "Server...".
    *   In the "General" tab, give your server a name (e.g., "Local PostgreSQL").
    *   In the "Connection" tab, enter the following:
        *   Host name/address: `localhost`
        *   Port: `5432`
        *   Maintenance database: `postgres`
        *   Username: `bosta_user`
        *   Password: The password in the .env file.
    *   Click "Save".
    * Right-click on your server and select "Create" > "Database"
    * Name the database bosta_assessment

4.  **Use `.env` file**: use the .env file from the following link:
"https://drive.google.com/file/d/1bDzsmau3-mOo8f1aXmF1xpjq-bhxzMx3/view?usp=sharing" by placing it in the root directory. if your username in postgreSQL is not postgres, then change it to your username or set the username to postgres.
## Running the Application

1.  **Install dependencies**:
    ```bash
    npm install
    ```
2.  **Start the server**:
    ```bash
    npm start
    ```
The server will be running at `http://localhost:3000`.

## API Documentation

### Books

*   **GET /books**
    *   **Description**: Get a list of all books.
    *   **Success Response**:
        *   **Code**: 200
        *   **Content**: `[{ "id": 1, "title": "The Lord of the Rings", "author": "J.R.R. Tolkien", "isbn": "978-0-618-64015-7", "quantity": 10, "shelf_location": "A1" }]`
*   **GET /books?search=:searchTerm**
    *   **Description**: Search for a book by title, author, or ISBN.
    *   **Success Response**:
        *   **Code**: 200
        *   **Content**: `[{ "id": 1, "title": "The Lord of the Rings", "author": "J.R.R. Tolkien", "isbn": "978-0-618-64015-7", "quantity": 10, "shelf_location": "A1" }]`
*   **POST /books**
    *   **Description**: Add a new book.
    *   **Request Body**:
        ```json
        {
            "title": "The Hobbit",
            "author": "J.R.R. Tolkien",
            "isbn": "978-0-618-00221-4",
            "quantity": 5,
            "shelf_location": "A2"
        }
        ```
    *   **Success Response**:
        *   **Code**: 201
        *   **Content**: `{ "id": 2, "title": "The Hobbit", "author": "J.R.R. Tolkien", "isbn": "978-0-618-00221-4", "quantity": 5, "shelf_location": "A2" }`
*   **PUT /books/:id**
    *   **Description**: Update a book.
    *   **Request Body**:
        ```json
        {
            "title": "The Hobbit",
            "author": "J.R.R. Tolkien",
            "isbn": "978-0-618-00221-4",
            "quantity": 4,
            "shelf_location": "A2"
        }
        ```
    *   **Success Response**:
        *   **Code**: 200
        *   **Content**: `{ "id": 2, "title": "The Hobbit", "author": "J.R.R. Tolkien", "isbn": "978-0-618-00221-4", "quantity": 4, "shelf_location": "A2" }`
*   **DELETE /books/:id**
    *   **Description**: Delete a book.
    *   **Success Response**:
        *   **Code**: 200
        *   **Content**: `{ "message": "Book deleted successfully" }`
*   **POST /books/:id/checkout**
    *   **Description**: Checkout a book for a borrower.
    *   **Request Body**:
        ```json
        {
            "borrowerId": 1,
            "dueDate": "2025-10-02"
        }
        ```
    *   **Success Response**:
        *   **Code**: 200
        *   **Content**: `{ "id": 1, "borrower_id": 1, "book_id": 1, "checkout_date": "2025-09-02T10:00:00.000Z", "due_date": "2025-10-02T00:00:00.000Z", "is_returned": false }`
*   **GET /books/overdue**
    *   **Description**: Get a list of all overdue books.
    *   **Success Response**:
        *   **Code**: 200
        *   **Content**: `[{ "id": 1, "borrower_id": 1, "book_id": 1, "checkout_date": "2025-08-01T10:00:00.000Z", "due_date": "2025-08-15T00:00:00.000Z", "is_returned": false }]`

### Borrowers

*   **GET /borrowers**
    *   **Description**: Get a list of all borrowers.
    *   **Success Response**:
        *   **Code**: 200
        *   **Content**: `[{ "id": 1, "name": "John Doe", "email": "john.doe@example.com", "registered_date": "2025-09-01T10:00:00.000Z" }]`
*   **POST /borrowers**
    *   **Description**: Add a new borrower.
    *   **Request Body**:
        ```json
        {
            "name": "Jane Doe",
            "email": "jane.doe@example.com"
        }
        ```
    *   **Success Response**:
        *   **Code**: 201
        *   **Content**: `{ "id": 2, "name": "Jane Doe", "email": "jane.doe@example.com", "registered_date": "2025-09-02T10:00:00.000Z" }`
*   **PUT /borrowers/:id**
    *   **Description**: Update a borrower.
    *   **Request Body**:
        ```json
        {
            "name": "Jane Smith",
            "email": "jane.smith@example.com"
        }
        ```
    *   **Success Response**:
        *   **Code**: 200
        *   **Content**: `{ "id": 2, "name": "Jane Smith", "email": "jane.smith@example.com", "registered_date": "2025-09-02T10:00:00.000Z" }`
*   **DELETE /borrowers/:id**
    *   **Description**: Delete a borrower.
    *   **Success Response**:
        *   **Code**: 200
        *   **Content**: `{ "message": "Borrower deleted successfully" }`
*   **POST /borrowers/:id/return**
    *   **Description**: Return a book.
    *   **Request Body**:
        ```json
        {
            "checkoutId": 1
        }
        ```
    *   **Success Response**:
        *   **Code**: 200
        *   **Content**: `{ "id": 1, "borrower_id": 1, "book_id": 1, "checkout_date": "2025-09-02T10:00:00.000Z", "due_date": "2025-10-02T00:00:00.000Z", "is_returned": true }`
*   **GET /borrowers/:id/listBooks**
    *   **Description**: Get a list of all books borrowed by a borrower.
    *   **Success Response**:
        *   **Code**: 200
        *   **Content**: `[{ "id": 1, "borrower_id": 1, "book_id": 1, "checkout_date": "2025-09-02T10:00:00.000Z", "due_date": "2025-10-02T00:00:00.000Z", "is_returned": false, "title": "The Lord of the Rings", "author": "J.R.R. Tolkien", "isbn": "978-0-618-64015-7", "quantity": 9, "shelf_location": "A1" }]`
