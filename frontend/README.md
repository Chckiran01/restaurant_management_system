🍽️ Restaurant Management System

A full-stack restaurant table reservation system with role-based access control for Users and Admins.
Users can book tables based on availability, while Admins can manage all reservations and monitor table usage.

🔗 Live Links

Live Application:
https://restaurant-management-system-livid.vercel.app/

GitHub Repository:
https://github.com/Chckiran01/restaurant_management_system

🛠️ Tech Stack
Frontend

React (Vite)

Tailwind CSS

React Router

Axios

Backend

Node.js

Express.js

MongoDB (Mongoose)

JWT Authentication

Deployment

Frontend: Vercel

Backend: Render

Database: MongoDB Atlas

Project Structure
Restaurant_management_system
│
├── backend
│   ├── controllers
│   ├── models
│   ├── routes
│   ├── middleware
│   ├── config
│   └── server.js
│
├── frontend
│   ├── src
│   │   ├── components
│   │   ├── pages
│   │   ├── context
│   │   ├── services
│   │   └── App.jsx
│   └── public
│
└── README.md

⚙️ Setup Instructions
1️⃣ Clone Repository
git clone https://github.com/Chckiran01/restaurant_management_system.git
cd restaurant_management_system

2️⃣ Backend Setup
cd backend
npm install


Create .env file:

PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key


Run backend:

npm start

3️⃣ Frontend Setup
cd frontend
npm install


Create .env file:

VITE_API_URL=https://restaurant-backend-fs12.onrender.com/api


Run frontend:

npm run dev

👥 Role-Based Access Control
User

Register & Login

View available tables by date and time slot

Book tables

View My Reservations

Cancel own active reservations

Admin

Login with admin role

View all reservations

Filter reservations by date

View available & booked tables

Update reservation date / time / table

Cancel any reservation

Admin interface clearly separated from user views

Authorization is enforced using JWT + Protected Routes on both frontend and backend.

🪑 Reservation & Availability Logic

Tables have fixed seating capacity (2, 4, 6, 10)

Availability is checked using:

Selected date

Selected time slot

Existing active reservations

A table is considered unavailable if:

It is already reserved for the same date & time slot

Backend ensures:

No double booking

Accurate conflict handling

🔐 Authentication Flow

JWT token stored in localStorage

Axios interceptor automatically attaches token to requests

Protected routes block unauthorized access

Role-based redirects after login:

User → /reserve

Admin → /admin
