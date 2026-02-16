# Incident Tracker Mini App

A full-stack web application that allows engineers to create, browse, and manage production incidents with server-side pagination, filtering, sorting, and search.

![Tech Stack](https://img.shields.io/badge/React-18-blue) ![Tech Stack](https://img.shields.io/badge/Spring_Boot-3.2-green) ![Tech Stack](https://img.shields.io/badge/PostgreSQL-15+-blue) ![Tech Stack](https://img.shields.io/badge/Java-17-orange)

---

## Table of Contents

- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Step-by-Step Setup & Run Guide](#step-by-step-setup--run-guide)
  - [Step 1: Clone the Repository](#step-1-clone-the-repository)
  - [Step 2: Install & Start PostgreSQL](#step-2-install--start-postgresql)
  - [Step 3: Create the Database](#step-3-create-the-database)
  - [Step 4: Run the Backend](#step-4-run-the-backend)
  - [Step 5: Run the Frontend](#step-5-run-the-frontend)
  - [Step 6: Open the Application](#step-6-open-the-application)
- [Connecting to the Database](#connecting-to-the-database)
- [Testing the Application](#testing-the-application)
  - [Testing the Backend API (curl)](#testing-the-backend-api-curl)
  - [Testing the Frontend UI](#testing-the-frontend-ui)
  - [Testing the Database](#testing-the-database)
- [API Overview](#api-overview)
- [PostgreSQL Commands & Queries Reference](#postgresql-commands--queries-reference)
- [Troubleshooting](#troubleshooting)
- [Design Decisions & Tradeoffs](#design-decisions--tradeoffs)
- [Improvements With More Time](#improvements-with-more-time)

---

## Tech Stack

| Layer    | Technology                  |
| -------- | --------------------------- |
| Frontend | React 18, TypeScript        |
| Backend  | Spring Boot 3.2, Java 17   |
| Database | PostgreSQL 15+              |
| HTTP     | Axios                       |
| Routing  | React Router v6             |
| ORM      | Spring Data JPA / Hibernate |

---

## Project Structure

```
incident-tracker-mini-app/
├── backend/                          # Spring Boot backend
│   ├── pom.xml                       # Maven dependencies
│   ├── mvnw / mvnw.cmd              # Maven wrapper (no Maven install needed)
│   └── src/main/java/com/incidenttracker/
│       ├── IncidentTrackerApplication.java   # Main entry point
│       ├── config/
│       │   ├── DataSeeder.java               # Seeds 200 records on first boot
│       │   └── WebConfig.java                # CORS configuration
│       ├── controller/
│       │   └── IncidentController.java       # REST API endpoints
│       ├── dto/
│       │   ├── CreateIncidentRequest.java    # POST request validation
│       │   ├── UpdateIncidentRequest.java    # PATCH request validation
│       │   └── IncidentResponse.java         # API response mapping
│       ├── entity/
│       │   └── Incident.java                 # JPA entity + table definition
│       ├── exception/
│       │   ├── GlobalExceptionHandler.java   # Centralized error handling
│       │   └── ResourceNotFoundException.java
│       ├── repository/
│       │   └── IncidentRepository.java       # Database queries (JPQL)
│       └── service/
│           └── IncidentService.java          # Business logic layer
├── frontend/                         # React frontend
│   ├── package.json                  # npm dependencies
│   └── src/
│       ├── App.tsx                   # App root with routing
│       ├── App.css                   # Global styles
│       ├── api/
│       │   └── incidentApi.ts        # Axios API client
│       ├── components/
│       │   ├── CreateIncidentModal.tsx
│       │   ├── Pagination.tsx
│       │   └── StatusBadge.tsx
│       ├── hooks/
│       │   └── useDebounce.ts        # Debounced search hook
│       ├── pages/
│       │   ├── IncidentList.tsx      # Main table page
│       │   └── IncidentDetail.tsx    # Detail/edit page
│       └── types/
│           └── incident.ts           # TypeScript interfaces
├── docker-compose.yml                # PostgreSQL via Docker
├── .gitignore
└── README.md
```

---

## Prerequisites

Make sure you have the following installed on your machine:

| Tool            | Version  | Check command          | Install (macOS)                  |
| --------------- | -------- | ---------------------- | -------------------------------- |
| **Java JDK**    | 17+      | `java -version`        | `brew install openjdk@17`        |
| **Maven**       | 3.8+     | `mvn -version`         | Included via `./mvnw` wrapper    |
| **Node.js**     | 18+      | `node -v`              | `brew install node`              |
| **npm**         | 9+       | `npm -v`               | Comes with Node.js               |
| **PostgreSQL**  | 15+      | `psql --version`       | `brew install postgresql@15`     |

> **Note:** If you have multiple Java versions installed, ensure Java 17+ is active:
> ```bash
> # Check installed versions
> /usr/libexec/java_home -V
>
> # Use Java 17 for the current session
> export JAVA_HOME=$(/usr/libexec/java_home -v 17)
> ```

> **Note:** If PostgreSQL binaries are not on your PATH (macOS Homebrew):
> ```bash
> # Add to current session
> export PATH="/opt/homebrew/opt/postgresql@15/bin:$PATH"
>
> # Add permanently to your shell
> echo 'export PATH="/opt/homebrew/opt/postgresql@15/bin:$PATH"' >> ~/.zshrc
> source ~/.zshrc
> ```

---

## Step-by-Step Setup & Run Guide

### Step 1: Clone the Repository

```bash
git clone <repository-url>
cd incident-tracker-mini-app
```

### Step 2: Install & Start PostgreSQL

**Option A: Using Docker (recommended -- no install needed)**

```bash
docker-compose up -d
```

This starts a PostgreSQL 15 container with the database pre-created. Skip to [Step 4](#step-4-run-the-backend).

**Option B: Using Homebrew (macOS)**

```bash
# Install PostgreSQL 15
brew install postgresql@15

# Add to PATH (required for psql, createdb, etc.)
export PATH="/opt/homebrew/opt/postgresql@15/bin:$PATH"

# Start PostgreSQL service
brew services start postgresql@15

# Verify it's running
pg_isready
# Expected output: /tmp:5432 - accepting connections
```

**Option C: Using apt (Ubuntu/Debian)**

```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

### Step 3: Create the Database

> **Skip this step if you used Docker (Option A)** -- the database is auto-created.

```bash
# For Homebrew installs (macOS -- connects as your OS user by default)
createdb incident_tracker

# Verify the database was created
psql -d incident_tracker -c "SELECT 1;"
# Expected output: ?column? = 1
```

If you installed PostgreSQL with a `postgres` superuser (Linux default):

```bash
# Switch to the postgres user
sudo -u postgres psql

# Inside psql:
CREATE DATABASE incident_tracker;
\q
```

### Step 4: Run the Backend

```bash
cd backend

# Using Maven wrapper (no Maven installation needed)
./mvnw spring-boot:run

# OR if you have Maven installed
mvn spring-boot:run

# OR if you need to specify Java 17 explicitly
JAVA_HOME=$(/usr/libexec/java_home -v 17) ./mvnw spring-boot:run
```

**If your database credentials differ from the defaults** (`postgres`/`postgres`), override them:

```bash
DB_USERNAME=myuser DB_PASSWORD=mypass ./mvnw spring-boot:run
```

**Expected startup output:**

```
Started IncidentTrackerApplication in 2.2 seconds
Seeding database with 200 incident records...
Successfully seeded 200 incidents.
```

The backend is now running on **http://localhost:8080**.

Quick verify:

```bash
curl -s http://localhost:8080/api/incidents?size=1 | python3 -m json.tool | head -5
```

### Step 5: Run the Frontend

Open a **new terminal** (keep the backend running):

```bash
cd frontend

# Install dependencies (first time only)
npm install

# Start the dev server
npm start
```

**Expected output:**

```
Compiled successfully!
Local: http://localhost:3000
```

### Step 6: Open the Application

Open your browser and navigate to:

**http://localhost:3000**

You should see the Incident Tracker with 200 seeded incidents in a paginated table.

**Summary of running services:**

| Service    | URL                     | Port |
| ---------- | ----------------------- | ---- |
| Frontend   | http://localhost:3000    | 3000 |
| Backend    | http://localhost:8080    | 8080 |
| PostgreSQL | localhost                | 5432 |

---

## Connecting to the Database

### Interactive psql Session

```bash
# Connect to the incident_tracker database
psql -d incident_tracker

# If using Docker
docker exec -it incident-tracker-db psql -U postgres -d incident_tracker

# If using Linux with postgres user
sudo -u postgres psql -d incident_tracker
```

### Useful psql Commands (once connected)

```
\dt                  -- List all tables
\d incidents         -- Show table schema (columns, types, constraints)
\di                  -- List all indexes
\conninfo            -- Show current connection info
\x                   -- Toggle expanded display (easier to read wide rows)
\q                   -- Exit psql
```

### Quick Queries to Verify Data

```sql
-- Total records
SELECT COUNT(*) FROM incidents;

-- Sample rows
SELECT id, title, service, severity, status, owner FROM incidents LIMIT 5;

-- Counts by severity
SELECT severity, COUNT(*) FROM incidents GROUP BY severity ORDER BY severity;

-- Counts by status
SELECT status, COUNT(*) FROM incidents GROUP BY status ORDER BY status;
```

---

## Testing the Application

### Testing the Backend API (curl)

Run these from any terminal while the backend is running on port 8080.

**1. List incidents (paginated, page 1, 5 per page):**

```bash
curl -s "http://localhost:8080/api/incidents?page=0&size=5" | python3 -m json.tool
```

**2. Search by title:**

```bash
curl -s "http://localhost:8080/api/incidents?search=Login&size=3" | python3 -m json.tool
```

**3. Filter by severity:**

```bash
curl -s "http://localhost:8080/api/incidents?severity=SEV1&size=5" | python3 -m json.tool
```

**4. Filter by status:**

```bash
curl -s "http://localhost:8080/api/incidents?status=OPEN&size=5" | python3 -m json.tool
```

**5. Filter by service:**

```bash
curl -s "http://localhost:8080/api/incidents?service=Backend&size=5" | python3 -m json.tool
```

**6. Sort by title ascending:**

```bash
curl -s "http://localhost:8080/api/incidents?sortBy=title&sortDir=asc&size=5" | python3 -m json.tool
```

**7. Combined filters:**

```bash
curl -s "http://localhost:8080/api/incidents?severity=SEV1&status=OPEN&service=Backend&sortBy=createdAt&sortDir=desc" | python3 -m json.tool
```

**8. Get a single incident by ID** (replace `<id>` with a real UUID from step 1):

```bash
curl -s "http://localhost:8080/api/incidents/<id>" | python3 -m json.tool
```

**9. Create a new incident:**

```bash
curl -s -X POST http://localhost:8080/api/incidents \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test Incident from CLI",
    "service": "Backend",
    "severity": "SEV2",
    "status": "OPEN",
    "owner": "tester@team.com",
    "summary": "Created via curl for testing."
  }' | python3 -m json.tool
```

**10. Update an incident** (replace `<id>` with a real UUID):

```bash
curl -s -X PATCH "http://localhost:8080/api/incidents/<id>" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "RESOLVED",
    "summary": "Issue has been resolved."
  }' | python3 -m json.tool
```

**11. Test validation (should return 400):**

```bash
curl -s -X POST http://localhost:8080/api/incidents \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Ab",
    "service": "",
    "severity": "SEV1",
    "status": "OPEN"
  }' | python3 -m json.tool
```

Expected: `400 Bad Request` with field-level validation errors.

**12. Test 404 (invalid ID):**

```bash
curl -s "http://localhost:8080/api/incidents/00000000-0000-0000-0000-000000000000" | python3 -m json.tool
```

Expected: `404 Not Found`.

### Testing the Frontend UI

Open **http://localhost:3000** in your browser and test:

| Feature               | How to test                                                    |
| --------------------- | -------------------------------------------------------------- |
| **Paginated table**   | 200 incidents show in pages of 10. Click page numbers at bottom. Change page size (5/10/20/50). |
| **Column sorting**    | Click any column header (Title, Service, Severity, Status, Created At, Owner). Click again to toggle asc/desc. Arrow indicator shows direction. |
| **Filter by service** | Use the "Service" dropdown to pick e.g. "Backend". Table updates immediately. |
| **Filter by severity**| Click SEV1/SEV2/SEV3/SEV4 checkboxes. Click again to deselect. |
| **Filter by status**  | Use the "Status" dropdown to pick "Open", "Mitigated", or "Resolved". |
| **Debounced search**  | Type in the search box. Results update ~400ms after you stop typing. Search matches title and owner. |
| **Reset filters**     | Click "Reset Filters" to clear all filters, search, and sorting. |
| **View detail**       | Click any row to navigate to the detail page. Shows all fields. |
| **Edit incident**     | On the detail page, click "Edit Incident". Change fields and click "Save Changes". Toast notification confirms success. |
| **Create incident**   | Click "+ New Incident" button. Fill out the form and click "Create Incident". New incident appears in the list. |
| **URL persistence**   | Apply filters, then copy the URL. Open it in a new tab -- filters are preserved. Browser back/forward works. |
| **Loading state**     | Visible briefly while data is fetched (spinner + "Loading incidents..."). |
| **Empty state**       | Apply filters that match nothing (e.g. search "zzzzzzz"). Shows "No incidents found." message. |
| **Error handling**    | Stop the backend, then refresh the page. Error message with "Retry" button appears. |

### Testing the Database

Connect to the database and verify data integrity:

```bash
psql -d incident_tracker
```

```sql
-- Verify 200+ records exist (200 seeded + any you created via UI/API)
SELECT COUNT(*) FROM incidents;

-- Check data distribution
SELECT severity, COUNT(*) AS count FROM incidents GROUP BY severity ORDER BY severity;
SELECT status, COUNT(*) AS count FROM incidents GROUP BY status ORDER BY status;
SELECT service, COUNT(*) AS count FROM incidents GROUP BY service ORDER BY service;

-- Verify indexes exist
\di

-- Check that a recently updated incident has a newer updated_at
SELECT title, status, created_at, updated_at FROM incidents ORDER BY updated_at DESC LIMIT 3;

-- Verify UUID primary keys are valid
SELECT id, title FROM incidents LIMIT 3;
```

---

## API Overview

Base URL: `http://localhost:8080/api`

### `POST /api/incidents`

Create a new incident.

**Request Body:**
```json
{
  "title": "API Timeout",
  "service": "Backend",
  "severity": "SEV1",
  "status": "OPEN",
  "owner": "dev@team.com",
  "summary": "API requests were timing out..."
}
```

**Validations:**
- `title`: required, 3-200 characters
- `service`: required, max 100 characters
- `severity`: required, one of `SEV1`, `SEV2`, `SEV3`, `SEV4`
- `status`: required, one of `OPEN`, `MITIGATED`, `RESOLVED`
- `owner`: optional, max 200 characters
- `summary`: optional, max 2000 characters

**Response:** `201 Created` with the incident object.

---

### `GET /api/incidents`

List incidents with server-side pagination, filtering, sorting, and search.

**Query Parameters:**

| Parameter  | Default     | Description                                                                                  |
| ---------- | ----------- | -------------------------------------------------------------------------------------------- |
| `page`     | `0`         | Page number (0-indexed)                                                                      |
| `size`     | `10`        | Page size (1-100)                                                                            |
| `sortBy`   | `createdAt` | Sort column: `title`, `service`, `severity`, `status`, `owner`, `createdAt`, `updatedAt`     |
| `sortDir`  | `desc`      | Sort direction: `asc` or `desc`                                                              |
| `search`   | -           | Search by title or owner (case-insensitive, partial match)                                   |
| `service`  | -           | Filter by exact service name                                                                 |
| `severity` | -           | Filter by severity (`SEV1`, `SEV2`, `SEV3`, `SEV4`)                                         |
| `status`   | -           | Filter by status (`OPEN`, `MITIGATED`, `RESOLVED`)                                          |

**Response:** Spring Data `Page<Incident>` with `content`, `totalElements`, `totalPages`, `number`, `size`, `first`, `last`, `empty`.

---

### `GET /api/incidents/:id`

Get a single incident by UUID.

**Response:** `200 OK` with the incident object, or `404 Not Found`.

---

### `PATCH /api/incidents/:id`

Partial update of an incident. Only provided fields are updated.

**Request Body (all fields optional):**
```json
{
  "status": "RESOLVED",
  "summary": "Root cause identified and fixed."
}
```

**Response:** `200 OK` with the updated incident object.

---

### Error Responses

All errors follow a consistent structure:
```json
{
  "timestamp": "2024-04-15T10:30:00",
  "status": 400,
  "error": "Validation Error",
  "errors": {
    "title": "Title is required",
    "service": "Service is required"
  }
}
```

---

## PostgreSQL Commands & Queries Reference

### Service Management

```bash
# Check if PostgreSQL is running
pg_isready

# Start PostgreSQL (Homebrew macOS)
brew services start postgresql@15

# Stop PostgreSQL (Homebrew macOS)
brew services stop postgresql@15

# Restart PostgreSQL (Homebrew macOS)
brew services restart postgresql@15

# Start PostgreSQL (Docker)
docker-compose up -d

# Stop PostgreSQL (Docker)
docker-compose down

# Stop PostgreSQL and remove data volume (full reset)
docker-compose down -v
```

### Database Management

```bash
# Create the database
createdb incident_tracker

# Drop and recreate (full data reset)
dropdb incident_tracker && createdb incident_tracker

# Connect interactively
psql -d incident_tracker

# Run a single query from the command line
psql -d incident_tracker -c "SELECT COUNT(*) FROM incidents;"
```

### Table Schema (auto-created by Hibernate)

```sql
CREATE TABLE incidents (
    id              UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
    title           VARCHAR(200) NOT NULL,
    service         VARCHAR(100) NOT NULL,
    severity        VARCHAR(10)  NOT NULL,   -- SEV1, SEV2, SEV3, SEV4
    status          VARCHAR(20)  NOT NULL,   -- OPEN, MITIGATED, RESOLVED
    owner           VARCHAR(200),
    summary         VARCHAR(2000),
    created_at      TIMESTAMP,
    updated_at      TIMESTAMP
);
```

### Indexes (auto-created by Hibernate)

```sql
CREATE INDEX idx_incident_service    ON incidents (service);
CREATE INDEX idx_incident_severity   ON incidents (severity);
CREATE INDEX idx_incident_status     ON incidents (status);
CREATE INDEX idx_incident_created_at ON incidents (created_at);
CREATE INDEX idx_incident_title      ON incidents (title);
```

### Queries Executed by the Application

**1. Seed data (first startup -- 200 records):**
```sql
INSERT INTO incidents (id, title, service, severity, status, owner, summary, created_at, updated_at)
VALUES (gen_random_uuid(), ?, ?, ?, ?, ?, ?, NOW(), NOW());
```

**2. Count records (seed idempotency check):**
```sql
SELECT COUNT(*) FROM incidents;
```

**3. List with pagination, filtering, sorting, search:**
```sql
SELECT * FROM incidents
WHERE (:search IS NULL OR LOWER(title) LIKE LOWER('%' || :search || '%')
       OR LOWER(owner) LIKE LOWER('%' || :search || '%'))
  AND (:service IS NULL OR service = :service)
  AND (:severity IS NULL OR severity = :severity)
  AND (:status IS NULL OR status = :status)
ORDER BY :sortBy :sortDir
LIMIT :size OFFSET :page * :size;
```

**4. Pagination count:**
```sql
SELECT COUNT(*) FROM incidents WHERE <same filters as above>;
```

**5. Fetch by ID:**
```sql
SELECT * FROM incidents WHERE id = :id;
```

**6. Create:**
```sql
INSERT INTO incidents (id, title, service, severity, status, owner, summary, created_at, updated_at)
VALUES (gen_random_uuid(), :title, :service, :severity, :status, :owner, :summary, NOW(), NOW());
```

**7. Update (partial):**
```sql
UPDATE incidents
SET title = :title, service = :service, severity = :severity,
    status = :status, owner = :owner, summary = :summary, updated_at = NOW()
WHERE id = :id;
```

### Handy Inspection Queries

```sql
-- View sample data
SELECT id, title, service, severity, status, owner FROM incidents LIMIT 10;

-- Count by severity
SELECT severity, COUNT(*) FROM incidents GROUP BY severity ORDER BY severity;

-- Count by status
SELECT status, COUNT(*) FROM incidents GROUP BY status ORDER BY status;

-- Count by service
SELECT service, COUNT(*) FROM incidents GROUP BY service ORDER BY service;

-- Find SEV1 OPEN incidents
SELECT title, service, owner FROM incidents WHERE severity = 'SEV1' AND status = 'OPEN';

-- Case-insensitive search
SELECT title, service FROM incidents WHERE LOWER(title) LIKE LOWER('%timeout%');

-- Check table size on disk
SELECT pg_size_pretty(pg_total_relation_size('incidents')) AS total_size;

-- Most recently updated incidents
SELECT title, status, updated_at FROM incidents ORDER BY updated_at DESC LIMIT 5;
```

---

## Troubleshooting

| Problem | Cause | Solution |
| ------- | ----- | -------- |
| `psql: FATAL: database "username" does not exist` | psql defaults to a DB named after your OS user | Use `psql -d incident_tracker` to specify the database |
| `psql: command not found` | PostgreSQL binaries not on PATH | Run `export PATH="/opt/homebrew/opt/postgresql@15/bin:$PATH"` |
| `FATAL: role "postgres" does not exist` | Homebrew PostgreSQL uses your OS username, not `postgres` | Run `DB_USERNAME=$(whoami) DB_PASSWORD= ./mvnw spring-boot:run` |
| `Connection refused` on port 5432 | PostgreSQL is not running | Run `brew services start postgresql@15` or `docker-compose up -d` |
| `Port 8080 already in use` | Another process on port 8080 | Run `lsof -i :8080` to find it, then `kill <PID>` |
| `Port 3000 already in use` | Another process on port 3000 | Run `lsof -i :3000` to find it, then `kill <PID>` |
| Backend starts but no data in table | Seed runs only if table is empty | Run `psql -d incident_tracker -c "DELETE FROM incidents;"` then restart backend |
| CORS errors in browser console | Backend not running or wrong port | Ensure backend is running on port 8080 |
| `release version 17 not supported` | Java version < 17 is active | Set `JAVA_HOME` to Java 17: `export JAVA_HOME=$(/usr/libexec/java_home -v 17)` |
| Frontend shows "Failed to load" | Backend API is not reachable | Start the backend first, then refresh the frontend |

---

## Design Decisions & Tradeoffs

### Backend

1. **UUID Primary Keys** -- UUIDs prevent enumeration attacks and work well in distributed systems. Trade-off: slightly larger index size compared to sequential integers.

2. **Database Indexes** -- Added indexes on `service`, `severity`, `status`, `createdAt`, and `title` columns since they are used for filtering and sorting. This speeds up reads at a minor cost to write performance.

3. **JPQL Query with Dynamic Filtering** -- A single repository query handles all combinations of filters using null-check patterns. This avoids N+1 queries and keeps the codebase simple. For more complex filtering, JPA Specifications or Criteria API could be used.

4. **Validation at Multiple Layers** -- Bean Validation annotations on both the entity and DTOs ensure data integrity. The global exception handler returns structured error responses.

5. **PATCH Semantics** -- The update endpoint only modifies fields that are present in the request body, following true PATCH semantics. This is more flexible than PUT.

6. **Data Seeder** -- The `CommandLineRunner` seeds 200 records on first boot with a fixed random seed for reproducible data. It's idempotent -- skips seeding if data already exists.

### Frontend

1. **Server-Side Pagination** -- All pagination, filtering, sorting, and search happen on the server. The frontend only fetches one page at a time, keeping the UI fast even with thousands of records.

2. **Debounced Search** -- Search input is debounced at 400ms to prevent excessive API calls while the user types.

3. **URL-Synced Filters** -- All filter/sort/page state is synced to URL search params. Users can bookmark or share filtered views, and the browser back button works correctly.

4. **Component Organization** -- Clear separation between pages (`IncidentList`, `IncidentDetail`), reusable components (`Pagination`, `StatusBadge`, `CreateIncidentModal`), API layer, types, and hooks.

5. **Loading, Empty, and Error States** -- Every async operation has proper loading spinners, empty states, and error handling with retry capabilities.

6. **TypeScript** -- Full TypeScript coverage for type safety across API calls, component props, and state management.

---

## Improvements With More Time

1. **Testing** -- Add unit tests (JUnit 5 + MockMvc for backend, React Testing Library for frontend), integration tests, and E2E tests (Cypress/Playwright).

2. **Docker Compose (full stack)** -- Containerize the entire stack (backend, frontend, PostgreSQL) for one-command startup.

3. **Authentication & Authorization** -- Add user auth with Spring Security + JWT. Restrict incident edits to owners/admins.

4. **Audit Trail** -- Track change history on incidents (who changed what, when) using a separate `incident_history` table.

5. **Real-time Updates** -- WebSocket or SSE for live incident status changes on the dashboard.

6. **Advanced Filtering** -- Date range filters, multi-select severity filters, full-text search with PostgreSQL `tsvector`.

7. **Accessibility** -- Full ARIA attributes, keyboard navigation, screen reader testing.

8. **Performance** -- Response caching (ETags), lazy loading, virtual scrolling for very large datasets.

9. **Monitoring** -- Structured logging, health check endpoints, Prometheus metrics.

10. **CI/CD** -- GitHub Actions pipeline for linting, testing, building, and deploying.
