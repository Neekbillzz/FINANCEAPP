# Naillaz API

Welcome to the backend API for **Naillaz**, a lightweight fintech personal finance management platform designed to track income, expenses, and financial analytics. 

This API is built using Node.js, Express, and MongoDB, featuring robust request validation using Joi and secure session management via JSON Web Tokens (JWT).

---

##   Tech Stack & Features

* **Runtime Environment:** Node.js
* **Framework:** Express.js
* **Database:** MongoDB (via Mongoose ODM)
* **Authentication:** JSON Web Tokens (JWT)
* **Validation Layer:** Joi Middleware
* **Cross-Origin Resource Sharing:** CORS enabled for frontend integration

---

##  Getting Started

### Prerequisites
Ensure you have the following installed on your local machine:
* [Node.js](https://nodejs.org/) (v16.x or higher recommended)
* [MongoDB Atlas Account](https://www.mongodb.com/cloud/atlas) (or a local MongoDB instance)

### Installation Steps

1. **Clone the repository and navigate to the project directory:**
   
       cd naillaz-backend

2. **Install project dependencies:**

       npm install

3. **Configure Environment Variables:Configure Environment Variables:**
Create a .env file in the root directory of your project and populate it with your local configurations:

         PORT=4 digits port number

         MONGO_URI=mongodb+srv://<username>:<password>@cluster0.xxxx.mongodb.net/naillaz?retryWrites=true&w=majority

         JWT_SECRET=your_super_secret_jwt_key_here

4. **Run the Application:** 

 Development Mode (with auto-reload):

       npm run dev

Production Mode:

       npm start

# Project Structure

    src/
    ├── controllers/      # Handles business and database logic
    ├── middlewares/      # Request filters (Joi validation, Auth protection)
    ├── models/           # Mongoose schemas (User, Transaction, etc.)
    ├── routes/           # Express router endpoints
    └── app.js            # Express application setup   
    ├──.env               # Environmental variables
    ├──.gitignore         # Secret storage
    ├──server.js          # Server configuration
    ├──README.md          # API documentation
    └──.env.example       # Environmental variables examples

# API Endpoints Reference

## Authentication (/api/auth)
    

| Method | Endpoint   | Description                                                                                 |   Auth Required                |
| :----- | :--------- | :------------------------------------------------------------------------------------------ | :--------------------------------------- |
| POST   | /api/auth/signup     | Registers a new user account| No |
| POST    | /api/auth/login     | Authenticates a user & returns a JWT token                                                                             | No         |
---       

## Transactions (/api/transactions)

| Method | Endpoint   | Description                                                                                 | Auth Required                  |
| :----- | :--------- | :------------------------------------------------------------------------------------------ | :--------------------------------------- |
| GET   | /api/transactions/income-summary     | Retrieves all logged transactions for the user | Yes (Bearer Token) |
| POST    | /api/transactions/income     | Creates a new income or expense transaction                                                                             | Yes (Bearer Token)         |                              |
| PUT    | /api/transactions/:id | Updates an existing transaction record                                                                     | Yes (Bearer Token) |
| DELETE | /api/transactions/:id | Deletes a specific transaction record                                                                              | Yes (Bearer Token)                              |

---

## Dashboard & Metrics

| Method | Endpoint   | Description                                                                                 | Auth Required                  |
| :----- | :--------- | :------------------------------------------------------------------------------------------ | :--------------------------------------- |
| GET   | /api/dashboard     | Fetches summary data (Total balance, net income/expense) | Yes (Bearer Token) |
| GET    | /api/analytics     | Compiles detailed historical financial charts data                                                                             | Yes (Bearer Token)         |                              |
| GET    | /api/settings | Gets specific user system/profile configurations                                                                     | Yes (Bearer Token) |

---

# Request & Response Payload Examples
## 1. User Registration (POST /api/auth/sign-up)
Expected JSON Body:

    {
      "name": "John Jones",
      "email": "jones@nzenergyt.com",
      "password": "securepassword123"
    }

---    
Successful Response (201 Created):

    {
     "success": true,
     "message": "User registered successfully! Please log in."
    }
---    

## 2. User Login (POST /api/auth/login)
Expected JSON Body:

    {
     "email": "jones@nzenergyt.com",
     "password": "securepassword123"
    }

---

Successful Response (200 OK):

    {
     "success": true,
     "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
    "id": "65c3b1234567890abcdef123",
    "name": "Alex Jones",
    "email": "alex@nzenergytech.com"
    }
    }


## Authentication & Password Recovery Endpoints

### 1. Request Password Reset
Initiates the password recovery sequence by verifying the user's email, generating a highly secure, time-sensitive cryptographic string, and dispatching a recovery link.

* **Endpoint:** `POST /api/auth/forgot-password`
* **Access:** Public

#### Request Body

    {
     "email": "alex@spendwise.com"
     }

## Behind the Scenes
 The server generates a random 32-byte hexadecimal crypto token.

The token is mapped to the user schema alongside a 1-hour expiration timestamp.

An automated transactional email is triggered via Nodemailer containing the unique token query parameter targeting the client-side recovery view.

#### Response (200 OK)

    {
    "message": "If that email exists, a password reset link has been dispatched."
    }
---


### 2. Reset Password

Consumes the cryptographic recovery token transmitted via the JSON payload and updates the user's security credentials upon validation.

Endpoint: POST /api/auth/reset-password

Access: Public

### Request Body
     JSON

       {
         "token":"306d6361170bef5698a8af87ba8d0a5e2c218aa3d24b47146730c6da6768ff6",
    "password": "NewSecuredPassword123"
        }


### Validation & Logic

Both inputs undergo structure checks enforced by a Joi validation middleware layer.

The system searches for a record matches the supplied token value where the threshold resetPasswordExpires is strictly greater than Date.now().

If found, the incoming raw string is safely auto-hashed using bcrypt before storage, and the temporary token variables are reset to null.

#### Response (200 OK)

    JSON

    {
       "message": "Password changed successfully! You can now login."
    }