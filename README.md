# Hirelens Notes App

A full stack note-taking application addressing Phase 1 and 2 of the Hirelens Challenge.

## Tech Stack & Requirements

### Runtimes / Tools
- Node.js (v20.x, tested on v20.11.1)
- npm (v10.x, tested on v10.2.4)
- PostgreSQL (v15) via Docker Compose docker-compose.yml 

### Backend
- **Framework**: NestJS (v10.x)
- **Database ORM**: MikroORM (v6.x) with PostgreSQL
- **Security**: JWT Authentication, Zod + nestjs-zod for DTO validation
- **Architecture**: Domain-Driven / Feature Layered (Controllers -> Services -> Entities)

### Frontend
- **Framework**: React / Vite
- **Routing**: @tanstack/react-router
- **State/Validation**: Zustand, Zod
- **Styling**: Tailwind CSS + Shadcn UI
- **Architecture**: Feature-Folder Architecture

## Getting Started

1. Set up and start the infrastructure using the provided start script:

   ```bash
   bash start.sh
   # OR you can manually run:
   # docker-compose up -d
   # cd backend && npm install && npm run start:dev
   # cd frontend && npm install && npm run dev
   ```

2. Access the Applications:
   - **Frontend UI**: http://localhost:3000
   - **Backend API**: http://localhost:3001
   - **Deploy URL**: https://hirelens-notes.vercel.app

## Default Credentials
When the backend connects to the database, it seamlessly generates a default user in development:
- **Username**: `admin`
- **Password**: `password123`

### Database Setup
 This project supports two ways of running the database:
 1. **Docker (Recommended for Reviewers)**: Run `docker-compose up` to start the PostgreSQL instance.
 2. **Local Installation**: If Docker is not available, ensure a PostgreSQL instance is running on `localhost:5432` with a database named `hirelens_notes`.

