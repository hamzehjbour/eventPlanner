# EventHub

## 1. What the app does

EventHub is a full-stack event management application built with Node.js, Express, MongoDB, and Vue 3.

Users can browse and search events by city and category, view detailed event information, register users for events with a selected number of tickets, and create new events. The application also supports pagination for the event list and manages event organizers, venues, and attendees.

## 2. Requirements and versions

### Backend

- Node.js 24.19.0
- Express.js
- MongoDB 8+
- Mongoose

### Frontend

- Vue 3
- Vite
- Vue Router

### Other

- npm

## 3. How to start MongoDB

MongoDB can be run locally or using Docker.

To run locally just make sure the you have MongoDB installed on you device

### Using Docker

Make sure Docker is installed and run:

docker compose up -d

This starts the MongoDB container in the background and run the backend with seeding and also the frontend

To verify that the container is running:

```bash
docker compose ps
```

## To Access the frontend when running docker open http://localhost:8080 in the browser

MongoDB Database for this project will be available on:

mongodb://localhost:27017/event_planner_db

## 4. Environment variables

created .env in both backend and frontend folder

backend env contains the MongoDB URI named DATABASE

frontend env contains the API\*URL under the name VITE_API_URL

## 5. Installing and running the application locally not using Docker

### Backend

Navigate to the backend directory:

```bash
cd backend
```

Install dependencies:

```bash
npm install
```

Start the backend:

```bash
npm run dev
```

The backend runs on:

```text
http://localhost:3000
```

### To seed the Database

```bash
npm run seed:import
```

### To delete the data that have been seeded from the database

```bash
npm run seed:delete
```

### Frontend

Open another terminal and navigate to the frontend directory:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

The frontend runs on:

```text
http://localhost:5173
```

Open the frontend in a browser at:

```text
http://localhost:5173
```

## 6. Seed script

The project includes a seed script that inserts sample data into MongoDB, including users, venues, events and registrations.

The seed script creates a small set of sample:

- Users
- Venues
- Events
- Registrations

This provides enough data to test the event listing, event details, event registration, filtering, and event creation functionality.

The seed script can be run again after clearing the database if fresh sample data is needed.

## 7. API endpoints

### Events

GET `/api/v1/events` Get a paginated list of events  
GET `/api/v1/events/:id` Get a single event and its details
GET `api/v1/envts/:id/attendees` Gets the attendees for a single event
POST `/api/v1/events` Create a new event  
POST `/api/v1/events/:id/register` Register a user for an event
DELETE `/api/v1/events/:id` Deletes a single event and its registrations
PATCH `/api/v1/events/:id` Updates a single event
GET `/api/v1/stats/top-venues` Gets the top 5 venues by registrations

The events list supports pagination and filtering by:

- City
- Category

Example:

### Users

| Method | Endpoint        | Description |
| ------ | --------------- | ----------- |
| GET    | `/api/v1/users` | Get users   |

### Venues

| Method | Endpoint         | Description |
| ------ | ---------------- | ----------- |
| GET    | `/api/v1/venues` | Get venues  |

> The exact API paths should be checked against the backend route configuration if the routes are mounted under a different prefix.

## 8. What was completed, skipped, and known issues

### Completed

- Event listing page
- Event pagination
- Event search by city
- Event filtering by category
- Event details page
- Event registration
- Create event page
- MongoDB integration
- Backend API
- Vue 3 frontend
- Vue Router navigation
- Seed data for users, venues, and events
- Docker setup for MongoDB

### Skipped

- Skipped JWT authentication
- Elasticsearch due to lack of storage on my device neccessary to set it up
- A waitlist instead of rejecting registrations
