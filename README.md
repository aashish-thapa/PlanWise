# PlanWise

PlanWise is your go-to event planning platform that helps you organize and manage events efficiently. With authentication, task management, expense tracking, and guest invitations, PlanWise ensures seamless event coordination.

## Features

### Authentication
- Secure JWT-based authentication.
- Login and signup functionality.

### Event Management
- Browse, add, edit, and delete events.
- View details for each event.

### Task Manager
- Create, edit, and delete tasks under each event.
- Manage a to-do list for better organization.

### Expense Management
- Track event expenses with categorized entries.
- Add, update, and delete expenses.

### Guest Management
- Add, update, and delete guests for an event.
- Send event invitations.
- Track whether invited guests have RSVP'd.

## Installation
The App is live at https://event-planner-7o83.vercel.app/ 

### Prerequisites
Ensure you have the following installed:
- Node.js
- Vue.js (Vue CLI recommended)
- MySQL or PostgreSQL (for database)
- Backend API (Node.js with Express)

### Clone the Repository
```sh
git clone https://github.com/your-repo/PlanWise.git
cd PlanWise
```

### Install Dependencies
```sh
npm install
```

### Set Up Environment Variables
Create a `.env` file in the root directory and add the following:
```
VUE_APP_BACKEND=http://localhost:5000 (Your backend API)
```

### Run the Application
```sh
npm run serve
```

### Backend Setup
If you haven't set up the backend yet, follow these steps:
1. Navigate to the backend directory:
   ```sh
   cd backend
   ```
2. Install backend dependencies:
   ```sh
   npm install
   ```
3. Create a `.env` file in the root directory and add the following:
```
PORT=
DB_HOST=
DBPORT=
DB_USER=
DB_PASS=
DB_NAME=
JWT_SECRET=
EMAIL_USER=
EMAIL_PASS=




```
3. Start the backend server:
   ```sh
   npm run start
   ```

## Usage
1. **Sign up/Login** to access PlanWise.
2. **Create an event** and manage its details.
3. **Add tasks** to keep track of event-related activities.
4. **Manage expenses** and categorize them as needed.
5. **Invite guests** and track RSVPs.
6. **Enjoy a well-organized event!**

## Contributing
Pull requests are welcome. Please open an issue first to discuss proposed changes.

## License
MIT License. See `LICENSE` for details.

