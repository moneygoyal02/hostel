# Hostel Management System

A comprehensive hostel management system for college hostels, designed for wardens and chief wardens to efficiently manage hostel-related activities.

## Features

- **Authentication**: Secure login system for wardens and chief wardens
- **Hostel Management**: Track details of 9 boys' hostels and 4 girls' hostels
- **Mess Menu Management**: Update and view monthly mess menus
- **Staff Management**: Add, update, and remove hostel staff details
- **Announcements**: Post and manage important notices
- **Role-Based Access Control**: Different permissions for chief wardens and hostel wardens

## Project Structure

The project is divided into two main parts:

### Backend (Server)
- Built with Node.js, Express, and TypeScript
- MongoDB database with Mongoose ODM
- REST API endpoints for all features
- Authentication with JWT

### Frontend (Client)
- Built with React and TypeScript
- Modern UI components
- State management with React Context API
- Responsive design for all devices

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- npm or yarn package manager

### Installation

1. Clone the repository
```
git clone <repository-url>
```

2. Install server dependencies
```
cd hostel-management/server
npm install
```

3. Install client dependencies
```
cd ../client
npm install
```

4. Create a `.env` file in the server directory with the following variables:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/hostel-management
JWT_SECRET=your_jwt_secret_key
NODE_ENV=development
```

### Running the Application

1. Start the server
```
cd server
npm run dev
```

2. Start the client
```
cd client
npm start
```

## Hostel Email IDs

### Boys' Hostels:
- hwb1@nitj.ac.in (Hostel 1)
- hwb2@nitj.ac.in (Hostel 2)
- hwb3@nitj.ac.in (Hostel 3)
- hwb4@nitj.ac.in (Hostel 4)
- hwb5@nitj.ac.in (Hostel 5)
- hwb6@nitj.ac.in (Hostel 6)
- hwb7@nitj.ac.in (Hostel 7)

### Girls' Hostels:
- mgha@nitj.ac.in (Mega Girls Hostel A)
- mghb@nitj.ac.in (Mega Girls Hostel B)
- mhba@nitj.ac.in
- mhbb@nitj.ac.in
- mhbf@nitj.ac.in
- mhg@nitj.ac.in
- ohwg1@nitj.ac.in
- ohwg2@nitj.ac.in 