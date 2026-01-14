Restaurant Management System

  A full-stack restaurant table reservation system with role-based access control for Users and Admins.
Users can book tables based on availability, while Admins can manage all reservations and monitor table usage.

Live Links

  Live Application: https://restaurant-management-system-livid.vercel.app/
  
  GitHub Repository: https://github.com/Chckiran01/restaurant_management_system
  
Tech Stack

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

Setup Instructions
    Clone Repository
    
    git clone https://github.com/Chckiran01/restaurant_management_system.git
    
    cd restaurant_management_system

  Backend Setup
  
      cd backend
      npm install

  Create .env file:
  
    PORT=5000
    MONGO_URI=your_mongodb_connection_string
    JWT_SECRET=your_secret_key
    

Run backend:

    npm start

Frontend Setup
   
    cd frontend
    npm install


Create .env file:

    VITE_API_URL=https://restaurant-backend-fs12.onrender.com/api


Run frontend:

    npm run dev

2. Assumptions Made

      Restaurant tables have fixed seating capacities (2, 4, 6, 10 seats).
      
      Reservations are made using predefined time slots.
      
      A table can only be booked once per date and time slot.
      
      Users can only manage their own reservations.
      
      Admin users have full control over all reservations.
      
      Authentication is required for all booking-related actions.

3. Reservation & Availability Logic

      Users select a date and time slot.
      
      Backend checks the reservations collection for existing active bookings.
      
      A table is considered available if:
      
      It is not already reserved for the selected date and time slot.
      
      Booking logic ensures:
      
      No overlapping reservations
      
      No double booking of the same table
      
      Availability checks are enforced on the backend to prevent conflicts.
      
4. Role-Based Access Control (User vs Admin)

    User Role
    
        Register and login
        
        View available tables
        
        Book a table
        
        View My Reservations
        
        Cancel their own active reservations
        
    Admin Role
    
        Login with admin credentials
        
        View all reservations
        
        Filter reservations by date
        
        View available and booked tables
        
        Update any reservation (date, time slot, table)
        
        Cancel any reservation
        
5. Known Limitations

        No email notifications or confirmations
        
        No password reset email flow
        
        Fixed time slots (not configurable via UI)
        
6. Areas for Improvement (With Additional Time)

        Email confirmations and reminders
        
        Dynamic time slot and table management
        
        Admin analytics dashboard
        
        Better error handling and loading states


Credentials for Admin

email
    
      test@example.com

password

    123456

Author

Chandra Kiran (Chckiran01)

Full-Stack Developer
