# SMTOps - Team Operations & Shift Handover Portal

SMTOps is a robust, production-ready enterprise web application designed to replace unstructured communication (WhatsApp, Excel) with a centralized portal for Shift Handovers, Issue Management, Machine Management, and Task Tracking in a manufacturing factory.

## Technology Stack
- **Frontend**: React 18, React Router, Axios, Vanilla CSS
- **Backend**: Node.js, Express.js, Socket.IO
- **Database**: PostgreSQL with Prisma ORM
- **Deployment**: PM2 (Backend) and IIS (Frontend + Reverse Proxy)

## Prerequisites
1. **Node.js** (v18+)
2. **PostgreSQL** (v14+)
3. **IIS (Internet Information Services)** (for Windows deployment)
   - Ensure the **URL Rewrite** module is installed in IIS.
4. **PM2** installed globally (`npm install -g pm2`)

## Local Development Setup

### 1. Database & Backend Setup
1. Open PowerShell / Command Prompt and navigate to the server folder:
   ```bash
   cd d:\SMTOps\server
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Copy the `.env.example` to `.env` and update the `DATABASE_URL` with your local Postgres credentials.
4. Run Prisma database push and the seed script:
   ```bash
   npx prisma db push
   node prisma/seed.js
   ```
5. Start the development server:
   ```bash
   npx nodemon src/server.js
   ```

### 2. Frontend Setup
1. In a new terminal, navigate to the client folder:
   ```bash
   cd d:\SMTOps\client
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the React development server:
   ```bash
   npm start
   ```

## Production Deployment (Windows Server / IIS)

### 1. Backend (PM2)
1. Navigate to `d:\SMTOps\server`.
2. Ensure dependencies are installed and the database is migrated (`npx prisma migrate deploy`).
3. Start the PM2 cluster:
   ```bash
   pm2 start ecosystem.config.js
   ```
4. Configure PM2 to start on boot (using `pm2-installer` or `pm2-windows-startup`).

### 2. Frontend (IIS)
1. Navigate to `d:\SMTOps\client`.
2. Build the production React app:
   ```bash
   npm run build
   ```
3. In IIS Manager, create a new Website pointing the Physical Path to `d:\SMTOps\client\build`.
4. The build process automatically copies the `web.config` file which sets up HTML5 routing and the reverse proxy to the PM2 backend (`http://localhost:5000/api`).

## Default Credentials
The initial seeding script generates a Super Admin user:
- **Employee ID**: ADM001
- **Password**: admin123
