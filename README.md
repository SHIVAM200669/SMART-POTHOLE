# Smart Pothole Detection System

A lightweight web application for reporting and managing potholes with a simple React frontend and Node.js/Express backend.

## Architecture

- **Frontend:** React, Vite, Tailwind CSS V4, React-Router, React-Leaflet
- **Backend:** Node.js, Express, Multer (local image upload), JWT Authentication
- **Database:** MySQL

## Prerequisites

- Node.js (v18+)
- MySQL Server

## Setup Instructions

### 1. Database Setup
Create a MySQL database (e.g., `pothole_db`).
Execute the SQL commands found in `backend/schema.sql` to create the necessary tables.

### 2. Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure Environment Variables:
   Open `backend/.env` and update the `DATABASE_URL` with your MySQL credentials.
4. Start the server:
   ```bash
   npm start
   ```
   (Alternatively, use `node server.js` or `nodemon server.js` for development).

### 3. Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

## Usage

1. Open the frontend in your browser (usually `http://localhost:5173`).
2. **Sign Up** as a new user. You can choose to be a `User` or `Admin`.
3. **User Dashboard:** Report a pothole by taking a picture, getting your location, and adding a description.
4. **Admin Dashboard:** Log in with an Admin account to see the analytics map, view all submitted complaints, and update their status (Pending, In Progress, Completed), assign workers, and set estimated completion times.

## AI Validation (MVP)
The AI validation is currently simulated using a dummy function in the backend `routes/complaints.js`. It randomly assigns a "Valid Pothole" or "Invalid/Fake" status along with a confidence score to demonstrate the flow. You can replace this logic with an actual API call to a computer vision model in the future.
