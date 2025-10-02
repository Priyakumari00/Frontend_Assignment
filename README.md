# 🚀 Scalable Web App with Authentication & Dashboard

A full-stack web application built with **React.js + Node.js/Express + MongoDB** that demonstrates **authentication, dashboard management, and CRUD operations**.  

---

## ✨ Features

### 🔹 Frontend
- Built with **React.js / Next.js**
- Responsive UI with **TailwindCSS**
- **Protected routes** (dashboard accessible only after login)
- Client-side & server-side **form validation**

### 🔹 Backend
- **Node.js + Express.js**
- **JWT-based authentication** (login/signup/logout)
- Secure **password hashing** with bcrypt
- CRUD APIs for a sample entity (**Tasks/Notes/Posts**)
- Connected to **MongoDB Atlas**

### 🔹 Dashboard
- View & update user profile
- Perform **CRUD operations** on entity
- **Search & filter** functionality
- Logout flow

### 🔹 Security & Scalability
- JWT authentication middleware
- Centralized error handling
- Structured codebase for easy scaling

---

## 📂 Project Structure
```bash
root/
├── backend/              # Node.js + Express backend
│   ├── models/           # Mongoose models
│   ├── routes/           # API routes
│   ├── controllers/      # Controller logic
│   ├── middleware/       # JWT auth, error handling
│   └── server.js         # Entry point
│
├── frontend/             # React.js / Next.js frontend
│   ├── src/
│   │   ├── components/   # Reusable components
│   │   ├── pages/        # Routes (Login, Register, Dashboard)
│   │   ├── services/     # API calls
│   │   └── App.js
│
├── README.md
└── package.json
```
## ⚙️ Installation & Setup
```bash
1. Clone the Repo
   git clone https://github.com/Priyakumari00/Frontend_Assignment.git
   cd Frontend_Assignment
```
```bash
2. Backend Setup
   cd backend
   npm install
```
```bash
   Create a .env file inside backend/:
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_secret_key

```
```bash
   Run the server:
   npm start

```
```bash
3. Frontend Setup
   cd frontend
   npm install
   npm start

```

