# Compensation Intelligence System

A full-stack web application designed to normalize and compare tech salaries across different companies using a standardized level system (L1-L10). Built with Next.js 14, Tailwind CSS, Prisma, and PostgreSQL.

## Core Features
- **Data Ingestion**: A robust submission form with client-side validation (`/submit`).
- **Standardized Level Mapping**: Compares different internal titles (e.g., Google L4 vs Amazon SDE II) apples-to-apples by mapping them to a global 1-10 ranking.
- **Company Insights**: View average compensation grouped by standardized levels on detailed company pages (`/companies/[id]`).
- **Side-by-Side Comparison**: Calculate the percentage pay difference between two companies based strictly on normalized levels (`/compare`).

## Setup Instructions

### 1. Environment Variables
Create a `.env` file in the root directory and add your PostgreSQL database URL. For local development, this will look something like:
```bash
DATABASE_URL="postgresql://user:password@localhost:5432/comp_db"
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Database Migrations & Seeding
Push the Prisma schema to your database and seed it with realistic test data (including LevelMappings for Google, Meta, Amazon):
```bash
# Sync database schema
npx prisma db push

# Populate DB with initial seed data
node prisma/seed.js
```

### 4. Run the Application
Start the development server:
```bash
npm run dev
```
Navigate to `http://localhost:3000/salaries` to view the dashboard and interact with the data!
