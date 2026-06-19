# Update Postman Collection

Update `apps/api/postman/govexa-api.postman_collection.json` to reflect the current state of the API routes. Run this whenever a route is added, changed, or removed.

**Usage:** `/postman` (no arguments — scans all route files automatically)

---

1. Read the current collection: `apps/api/postman/govexa-api.postman_collection.json`

2. Scan all route files in `apps/api/src/modules/**/`.routes.ts` to find every registered route. For each route, note:
   - HTTP method (GET, POST, PUT, PATCH, DELETE)
   - Path (e.g. `/trips/:tripId/start`)
   - Which module it belongs to
   - Auth required? (check for `authenticate` in the preHandler)
   - Request body shape (from the Zod schema in `*.schema.ts`)
   - Response shape (from the service return type)

3. Compare the scanned routes against the existing collection entries:
   - **New route** → add a new request entry under the correct module folder
   - **Changed route** (URL, method, body, or response) → update the existing entry
   - **Removed route** → remove the entry from the collection
   - **Unchanged route** → no action needed

4. For each new or updated request entry, populate:
   - `name`: action-oriented (e.g. "Start Trip", "Mark Student Boarded")
   - `method` + `url`: use `{{baseUrl}}` for the host
   - `auth`: "No Auth" for public endpoints; "Inherit from parent" for authenticated endpoints
   - `description`: purpose, required role, request body fields, example error codes
   - At least one saved example response for the 200/201 happy path
   - At least one saved example response for the primary error case (400, 401, 404, etc.)

5. Write the updated collection back to `apps/api/postman/govexa-api.postman_collection.json`.

6. Report what changed:
   - Routes added to collection
   - Routes updated in collection
   - Routes removed from collection
   - Routes already in sync (no changes needed)

**Collection structure reminder:**
The collection is organized by domain module folder: System, Auth, Students, Parents, Drivers, Buses, Routes, Trips, Tracking, Attendance, Incidents. Match the module name to the correct folder.
