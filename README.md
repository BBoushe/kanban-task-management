# Kanban Task Management Platform

A real-time, Trello-like application for task management, built with Next.js, Firebase, and TypeScript. Users can create boards, columns, and cards, drag-and-drop tasks, and perform CRUD operations with secure user authentication.

## Features
- Real-time synchronization
- Drag-and-drop task management
- Detailed card views (with comments)
- Secure authentication
- Persistent state with Firestore

## Demo
**Important note**: As of the most recent push, for testing purposes I recommend registering an account normaly, instead of using Google because of a problem with Firebase. 

#### Basic Workflow
![Alt text](demos/output.gif?raw=true "Basic Workflow Demo")

#### Drag and drop, sorting, detailed card view
![Alt text](demos/output2.gif?raw=true "Sorting, Rearranging, Card Functionality, Card View")

#### Register constraints
![Alt text](demos/output3.gif?raw=true "Register constraints")

#### Register with Google
![Alt text](demos/output4.gif?raw=true "Register with Google")

## Getting Started
1. **Clone** this repository.
2. **Install** dependencies with `npm install` or `yarn`.
3. **Configure** Firebase credentials in a `.env` file.
4. **Run** the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5.	Open your browser at http://localhost:3000.