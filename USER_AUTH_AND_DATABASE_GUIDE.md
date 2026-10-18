# WonderCave — Authentication, Access Control & Google Sheets Database Guide

This guide details how user authentication is handled, how to create and block accounts, how the Google Sheets database operates, and where the spreadsheet configuration is managed across WonderCave (`wondercave.nayem.net`).

---

## 1. How User Authentication is Handled

WonderCave uses a secure session token architecture with client-side verification and server-side credential enforcement.

### 1.1 Architecture Flow
1. **Login Submission**: The user submits credentials at `/login` via `POST /api/login`.
2. **Server Verification** (`server.ts`):
   - The server inspects `data/users.json`.
   - Validates that the provided email and password match an existing record.
   - **Block Status Check**: Verifies that `user.blocked !== true`. If blocked, the server immediately denies access with an `HTTP 403 Forbidden` response:
     ```json
     { "error": "Access Denied: This user account has been blocked by an administrator." }
     ```
   - Strips the password and issues a signed session token `csrf_token_dummy_<timestamp>` along with safe user metadata (`id`, `name`, `email`, `role`).
   - Appends a login record to `data/activity.json` for security audit telemetry.
3. **Client-Side Persistence** (`src/pages/Login.tsx`):
   - `localStorage.setItem("sc_token", token)`
   - `localStorage.setItem("sc_token_expiry", timestamp_24h)`
   - `localStorage.setItem("sc_user", JSON.stringify(user))`
4. **Route Protection** (`src/components/AuthGuard.tsx`):
   - Any access to `/dashboard` is wrapped in `<AuthGuard>`.
   - If the token is missing or expired (`Date.now() > sc_token_expiry`), the user is automatically redirected to `/login` with credentials flushed.

### 1.2 Default Sandbox Credentials
* **Enterprise Administrator**:
  * Email: `admin@wondercave.nayem.net`
  * Password: `password123`
* **Pro Researcher**:
  * Email: `test@wondercave.nayem.net`
  * Password: `password123`

---

## 2. How to Add New Users

You can provision new user accounts using three methods:

### Method A: Admin Dashboard (Recommended)
1. Sign in as an administrator at `/login`.
2. Open the **Dashboard** at `/dashboard`.
3. In the left navigation, click **Team Access & Users**.
4. Fill in the **Provision New User** form:
   - **Full Name**: e.g., `Nayem Hasan`
   - **Email Address**: e.g., `nayem@wondercave.nayem.net`
   - **Password**: e.g., `SecurePass2026!`
   - **Role / Tier**: Choose `Enterprise`, `Pro`, `Auditor`, or `Student`.
5. Click **Add User**. The account is created instantly and can log in immediately.

### Method B: REST API Endpoint
Send an HTTP POST request to `/api/users`:
```bash
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Jane Hacker",
    "email": "jane@wondercave.nayem.net",
    "password": "password123",
    "role": "Enterprise"
  }'
```
**Response (201 Created):**
```json
{
  "success": true,
  "user": {
    "id": 1729000000000,
    "name": "Jane Hacker",
    "email": "jane@wondercave.nayem.net",
    "role": "Enterprise",
    "blocked": false,
    "createdAt": "2026-10-15T00:50:00.000Z"
  }
}
```

### Method C: Direct File Editing
Open `/data/users.json` and append a user record to the JSON array:
```json
{
  "id": 3,
  "name": "Alex Mercer",
  "email": "alex@wondercave.nayem.net",
  "password": "mypassword",
  "role": "Pro",
  "blocked": false,
  "createdAt": "2026-10-15T00:00:00.000Z"
}
```

---

## 3. How to Block and Unblock Users

When a user is blocked, their account remains in the database for auditing purposes, but they cannot authenticate or access the dashboard.

### Method A: One-Click in the Dashboard
1. Go to `/dashboard` -> **Team Access & Users**.
2. Locate the user in the **All Registered Accounts** table.
3. Click the red **Block User** button.
   - The user's status badge changes to `BLOCKED`.
   - If the user attempts to sign in at `/login`, they receive:  
     `"Access Denied: This user account has been blocked by an administrator."`
4. To restore access, click **Unblock Account**. The badge reverts to `ACTIVE`.

### Method B: REST API Endpoint
Send a POST request to toggle the block state by user ID:
```bash
# Toggle block state (switches active -> blocked or blocked -> active)
curl -X POST http://localhost:3000/api/users/1/toggle-block
```

### Method C: Direct File Editing
Open `/data/users.json`, locate the user, and change `"blocked": false` to `"blocked": true`:
```json
{
  "id": 2,
  "name": "Tester",
  "email": "test@wondercave.nayem.net",
  "password": "password123",
  "role": "Pro",
  "blocked": true
}
```

---

## 4. How the Database is Managed via Google Sheets

WonderCave uses Google Sheets as a free headless Content Management System and database engine.

### 4.1 How It Works
```
+-----------------------------+
|    Google Sheets (Cloud)    |
| (Published to Web as CSV)   |
+--------------+--------------+
               | HTTP Fetch via /api/sync-sheets
               v
+-----------------------------+
|   Node/Express Backend      |
|        (server.ts)          |
|  - RFC-4180 CSV Parser      |
|  - Merge & Validation Engine|
+--------------+--------------+
               | Writes & Persists
               v
+-----------------------------+
|    Local Database Cache     |
|     (data/pages.json)       |
+--------------+--------------+
               | Serves instantly
               v
+-----------------------------+
|  React Single Page App      |
|  - Global Navbar Search     |
|  - Topics, Labs & Articles  |
|  - 0-latency page loads     |
+-----------------------------+
```

### 4.2 Advantages of This Setup
1. **100% Free**: Zero cloud database charges or recurring hosting costs.
2. **Collaborative & Non-Technical**: Non-developers can add or edit vulnerability tutorials, courses, and articles directly in Google Sheets without opening code.
3. **High-Performance Resiliency**: The Express server synchronizes rows from Google Sheets and writes them to `data/pages.json`. If Google Sheets experiences latency or connectivity issues, the platform continues serving from the cached database with zero downtime.

### 4.3 Required Google Sheet Column Schema
To sync pages or blog posts, structure the Google Sheet with the following header row (case-insensitive):

| Column Header | Type | Description | Example |
| :--- | :--- | :--- | :--- |
| **`slug`** *(or `id`)* | String | Unique URL slug for the page or post | `sql-injection` |
| **`title`** | String | Main title displayed on the page | `SQL Injection (SQLi)` |
| **`subtitle`** | String | Brief summary or value proposition | `Bypassing authentication and extracting database schemas.` |
| **`content`** | Markdown | Full article or body content | `## Overview\nSQL injection occurs when...` |
| **`imageUrl`** | URL | High-definition Unsplash or image URL | `https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5` |

---

## 5. Where the Google Sheet URL is Configured

The Google Sheets URL is managed in three locations:

### 5.1 Location 1: Dashboard UI (Interactive Management)
* **Path**: Navigate to `/dashboard` -> **Database & Settings**.
* **Input Box**: **Published Google Sheet CSV Endpoint URL**.
* **Action**: Paste your public Google Sheets CSV URL and click **Sync Database Now**.
* The server will immediately pull the rows, merge them into `data/pages.json`, and update the sync timestamp.

### 5.2 Location 2: Backend Defaults (`server.ts`)
The spreadsheet endpoint and fallback logic are configured in `server.ts`:
* **Active Sheet URL**:
  ```typescript
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vTSsdCfcokUgW5nLtHk4ZquGROq-RxMitDUTEgzQMTrClc3ZusFk-09kq1bXUUQgnx4IbknxU2la9XX/pub?output=csv"
  ```

### 5.3 Location 3: Runtime Sync State (`data/sheets_sync.json`)
Whenever a sync is performed, metadata is persisted in `data/sheets_sync.json`:
```json
{
  "lastSynced": "2026-10-15T01:00:00.000Z",
  "sheetUrl": "https://docs.google.com/spreadsheets/d/e/2PACX-1vTSsdCfcokUgW5nLtHk4ZquGROq-RxMitDUTEgzQMTrClc3ZusFk-09kq1bXUUQgnx4IbknxU2la9XX/pub?output=csv",
  "totalPagesSynced": 30,
  "status": "Synced successfully",
  "timestamp": 1729000000000
}
```

---

## 6. How to Connect Your Own Google Sheet (Step-by-Step)

Follow these steps to link your personal or organizational Google Sheet:

1. **Create a Google Sheet**:
   - Go to [Google Sheets](https://sheets.new).
   - In row 1, add columns: `slug`, `title`, `subtitle`, `content`, `imageUrl`.
   - Add your academy pages or blog posts in subsequent rows.
2. **Publish to Web as CSV**:
   - In Google Sheets, click **File** -> **Share** -> **Publish to web**.
   - Under **Link**, change **Entire Document** (or your sheet tab) and select **Comma-separated values (.csv)** from the dropdown.
   - Click **Publish** and copy the generated URL (it will look like `https://docs.google.com/spreadsheets/d/e/2PACX-.../pub?output=csv`).
3. **Sync in WonderCave**:
   - Go to `https://wondercave.nayem.net/dashboard` (or `http://localhost:3000/dashboard`).
   - Click **Database & Settings**.
   - Paste your URL into the **Published Google Sheet CSV Endpoint URL** field.
   - Click **Sync Database Now**.
4. **Verification**:
   - The dashboard will show: `Successfully synced X entries from Google Sheets`.
   - The newly added articles and pages will appear immediately in the global navbar search (`⌘K`) and on their respective routes.

---

*Document managed for WonderCave (`wondercave.nayem.net`) by Nayem Hasan.*
