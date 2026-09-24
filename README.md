# 🎟️ EventHub - Next-Gen Event Management Platform (MERN)

A modern, full-stack event discovery, creation, and participant ticketing platform built according to the **KGiSL Skillrty Internship Presentation** specifications.

---

## 🏗️ Architecture & Modules Overview

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                       EVENT MANAGEMENT PLATFORM (MERN)                      │
├───────────────────┬───────────────────┬───────────────────┬─────────────────┤
│   01. Auth &      │  02. Event CRUD   │ 03. Discovery &   │ 04. Dashboard & │
│     Profile       │   & Management    │   Registration    │   Participants  │
│ • Registration    │ • Create Event    │ • Explore Events  │ • User Bookings │
│ • JWT Login       │ • Update Details  │ • Search & Filter │ • Organizer Hub │
│ • bcrypt Hashing  │ • Delete Event    │ • Event Details   │ • Attendee List │
│ • User Profile    │ • Capacity/Venue  │ • Instant Booking │ • Live Stats    │
├───────────────────┴───────────────────┴───────────────────┴─────────────────┤
│                     05. API, Database & Security Layer                      │
│ • Express REST APIs  • MongoDB / Mongoose Models  • Protected Routes & JWT  │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## ⚡ Functional Modules (Slides 06 & 07)

### **Module 01: User Authentication & Profile**
- User registration and login with encrypted password storage (`bcryptjs`).
- Stateless authentication using JSON Web Tokens (**JWT**).
- Role segregation: **Attendee (Participant)** vs **Organizer**.

### **Module 02: Event Creation & Management (CRUD)**
- Complete CRUD operations for event organizers.
- Fields: Title, category, date, time, location/venue, online indicator, banner image URL, capacity, pricing, tags.
- Organizers can update event parameters and delete events with automatic cascading registration cleanups.

### **Module 03: Event Discovery & Registration**
- Mandatory Attendee Registration fields: Full Name, Email, Phone/WhatsApp, Institution/Company, Role/Designation, Special Requests.
- Catalog of active events with category filtering (*Tech & AI, Workshops, Music & Festivals, Business & Networking, Design & Art*).
- Real-time search query filtering by title, topic, or venue.
- Detailed view with seat capacity progress indicator, organizer card, and instant registration modal.

### **Module 04: Event & Participant Management Dashboard**
- **Attendee View**: "My Registered Passes" with digital pass verification, ticket code generator (`EVT-XXXXX`), and option to cancel tickets.
- **Organizer Hub**: Overview of hosted events, live registration counts vs total capacity, and a dedicated **Attendee List Viewer** with participant contacts.

### **Module 05: REST API, Database & Security Layer**
- Express REST architecture with modular controllers, routes, and centralized error handling middleware.
- MongoDB / Mongoose Schemas (`User`, `Event`, `Registration`) with built-in fallback to MongoDB Memory Server for immediate zero-config local testing.

---

## 🛠️ Tech Stack (Slide 08)

| Layer | Technologies |
|---|---|
| **Frontend** | React 18, Vite, Lucide Icons, Cyber Obsidian CSS Theme |
| **Backend** | Node.js, Express.js REST API |
| **Database** | MongoDB & Mongoose ORM |
| **Security** | JWT (JSON Web Tokens), `bcryptjs` password hashing |

---

## 🚀 Getting Started

### 1. Start the Backend Server (Port 5000)
```bash
cd server
npm install
npm start
```
*The server will start on `http://localhost:5000` with auto-seeded demo events and users.*

### 2. Start the Frontend Client (Port 3000)
```bash
cd client
npm install
npm run dev
```
*Open your browser at `http://localhost:3000`.*

---

## 🔑 Demo Credentials

| Role | Email | Password |
|---|---|---|
| **Organizer** | `organizer@eventify.com` | `password123` |
| **Attendee** | `alex@example.com` | `password123` |
