# SBA MongoDB Database Application
Node + Express + MongoDB Atlas + Mongoose

An API to manage **Users**, **Projects**, and **Tasks** with full CRUD, DB-side validation, sensible indexes, seed data, and simple reporting endpoints (aggregations).

---

## ✨ Features (What this app demonstrates)

- **Three collections**: `users`, `projects`, `tasks`
- **CRUD API** for each collection (GET, POST, PATCH, DELETE)
- **Mongoose** models (ODM) with schema validation
- **MongoDB $jsonSchema** validation applied **database-side** (via script)
- **Indexes** for common query patterns (unique + compound + text)
- **Aggregation reports**:
  - `/api/reports/tasks-by-status`
  - `/api/reports/velocity`
  - `/api/reports/top-contributors`
- **Seed script** with 10+ example docs per collection
- **Error handling** middleware (404 + centralized error handler)
- **Clean code organization** (models, controllers, routes, scripts, middleware)

---

## 🧱 Tech Stack

- **Runtime**: Node.js (ES Modules)
- **Web**: Express
- **Database**: MongoDB Atlas
- **ODM**: Mongoose
- **Utilities**: dotenv, morgan, cors, nodemon

---

## 🗂 Project Structure

SBA_MongoDB_Database_Application/
├─ app.mjs
├─ db.mjs
├─ package.json
├─ .gitignore
├─ .env 
├─ .env.example
├─ README.md
├─ 
│
├─ models/
│ ├─ user.model.mjs
│ ├─ project.model.mjs
│ └─ task.model.mjs
│
├─ controllers/
│ ├─ users.controller.mjs
│ ├─ projects.controller.mjs
│ ├─ tasks.controller.mjs
│ └─ reports.controller.mjs
│
├─ routes/
│ ├─ users.routes.mjs
│ ├─ projects.routes.mjs
│ ├─ tasks.routes.mjs
│ └─ reports.routes.mjs
│
├─ middleware/
│ └─ error.mjs
│
├─ scripts/
│ ├─ setupValidation.mjs 
│ ├─ createIndexes.mjs 
│ └─ seed.mjs 
│
└─ data/
  ├─ users.json
  ├─ projects.json
  └─ tasks.json

##  Quick Start

 You need a MongoDB Atlas cluster and a DB user with **dbOwner** (or `readWrite` + `dbAdmin`) on your DB (e.g., `sba_db`). Also allow your IP in **Network Access**.

 **Install dependencies**
   npm install




## Validation (DB-side + App-side)
### Mongoose schemas validate basic shape/types before writes.

### MongoDB $jsonSchema (via scripts/setupValidation.mjs) enforces constraints inside the DB, ensuring consistency even if app code changes:

- users: name, email required, pattern for email, role enum

- projects: name, owner required, status enum, members as ObjectId[]

- tasks: title, project required; status enum; numeric points ≥ 0

# How to see it fail (on purpose)
Try POST /api/tasks without title or project → should error due to DB validation.

# Indexing Strategy
- users.email → unique (fast lookups + consistency)

- projects.owner, status → filter dashboards by owner + status

- projects.createdAt: -1 → recent projects lists

- tasks.project, status → common list filters

- tasks.assignee, dueDate → upcoming tasks per user

- tasks.title: 'text' → simple text search

# Tradeoffs

We did not index labels because it can be high write-to-read; indexing every array field increases write cost. If your use case searches labels frequently, consider labels: 1 with caution.



# Step-by-Step: How I Built the App
Initialize project & tooling
Setup package.json, .gitignore, Nodemon script, minimal README, and installed dependencies.

Bootstrap Express
Created app.mjs with CORS, JSON parser, request logging, and a health route /.

Connect to Atlas via Mongoose
Wrote db.mjs to read MONGO_URI + DB_NAME from .env and connect before starting the server.

Data Models (Mongoose)
Implemented User, Project, Task models with schema rules and indexes (text + compound + unique).

Controllers & Routes
Built CRUD controllers for each entity with filtering/pagination, and mounted routes:

/api/users, /api/projects, /api/tasks

Reports (Aggregations)
Added /api/reports/* endpoints using MongoDB aggregation pipelines.

DB-side Validation
Added scripts/setupValidation.mjs to enforce $jsonSchema in MongoDB itself.

Indexes Script
Added scripts/createIndexes.mjs to centralize index creation.

Seed Data & Script
Created data/*.json and scripts/seed.mjs to populate collections with realistic sample data.

Error Handling
Centralized 404 and error middleware for clean responses and easier debugging.

README & Docs
Documented routes, setup steps, and examples. (This file.)



🧯 Troubleshooting
MONGO_URI missing → Ensure your .env exists at the root and you restarted the server.

Auth/Timeout → Check Atlas Database Access (user/roles) and Network Access (IP allowlist).

collMod not authorized → Run validation before collections are created OR grant dbOwner/dbAdmin on your DB OR drop the collection and re-run validation.

Port in use → Change PORT in .env (e.g., 5000) and restart.

📦 Submission Checklist
 GitHub repo link included (commit frequently)

 README with setup + routes (this file)

 Three collections with CRUD

 DB validation + index scripts

 Seed data (≥ 5 per collection; we provided ~10)

 App runs without errors; blockers documented if any

 Level of effort/UX: filters, pagination, reports, clean structure

🧠 Reflection
1) What could I have done differently during planning to make execution easier?

Define a very small core: 3 models → CRUD → validate → index → seed.

Sketch the data model early to ensure references and indexes match planned queries.

Write the scripts (validation/indexes/seed) right after models so local/teammates can get identical DB state quickly.

2) Which requirements were difficult, and how to make them easier next time?

DB-side validation ($jsonSchema) can fail with collMod permissions in Atlas. Next time, I’ll:

Run the validation script before inserting any data (so it can create collections with validation).

Ensure the DB user has dbOwner or dbAdmin on the target DB from the start.

Designing useful indexes without over-indexing: I used actual query shapes from controllers to guide compound indexes. In the future, I’d add query logs and test with larger datasets to validate choices.

3) What would I add or change with more time?

AuthN/AuthZ (JWT) and role-based permissions.

E2E tests (Playwright) + integration tests (Supertest) + unit tests (Vitest/Jest).

A small React frontend to browse/filter tasks visually.

More reports (lead time, cycle time) and background jobs (auto-close stale tasks).

Partial text search on more fields (or Atlas Search).

4) Notes to my future self

Keep models simple and normalize where needed; only denormalize when it solves a real query performance issue.

Always pair new queries with a quick “do we need an index?” check.

Write seed data and scripts early; they accelerate development and grading.

Document curl examples—it makes demos and debugging painless.

📎 License
For educational use in the Per Scholas SBA. Reuse with attribution is appreciated.

