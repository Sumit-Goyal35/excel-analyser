# Excel Analyzer (MERN Stack)

A full-stack application for analyzing Excel files, built using the MERN stack (MongoDB, Express, React, Node.js). The project includes authentication and an admin panel for managing users and data.

## Overview

This application allows users to upload Excel files, view structured data, and perform basic analysis. It also provides secure authentication and role-based access, with an admin dashboard for management tasks.

## Features

* Upload and parse Excel files (.xlsx, .csv)
* Display data in a structured format
* Basic data analysis capabilities
* User authentication (login and registration)
* Role-based access control (admin and user)
* Admin panel for managing users and uploaded data
* RESTful API integration

## Tech Stack

* Frontend: React
* Backend: Node.js, Express
* Database: MongoDB
* Authentication: JWT

## Project Structure

```
/client        Frontend application (React)
/server        Backend application (Node.js, Express)
/models        Database schemas
/routes        API routes
/controllers   Application logic
/middleware    Authentication and error handling
```

## Installation

1. Clone the repository

   ```
   git clone https://github.com/Sumit-Goyal35/excel-analyser.git
   cd excel-analyzer
   ```

2. Install dependencies

   ```
   cd client
   npm install

   cd ../server
   npm install
   ```

3. Configure environment variables

Create a `.env` file in the server directory:

```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

4. Run the application

Start the backend:

```
cd server
npm run dev
```

Start the frontend:

```
cd client
npm start
```

## Authentication

* JWT-based authentication
* Password hashing for secure storage
* Protected routes for authenticated users
* Admin-only access for management features

## Admin Panel

* View and manage users
* Monitor uploaded files
* Control access permissions

## Excel Processing

* Supports .xlsx and .csv files
* Parses and displays file data
* Enables simple analysis and summaries

## Future Improvements

* Advanced data visualization
* Export functionality
* File versioning
* Improved analytics