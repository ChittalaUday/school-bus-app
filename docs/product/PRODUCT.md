# Govexa — Product Design Document

> **This is the authoritative product reference.** Every feature, screen, workflow, and notification must align with this document. Read this before building any user-facing functionality.

---

## 1. Mission

> Every student should be safely transported while schools and parents have complete visibility into the transportation journey.

Govexa is a **Student Transportation Management Platform** — not fleet management software. The bus is not the center of the system. The student is.

---

## 2. Core Problem

Most schools manage transportation through phone calls, WhatsApp groups, Excel sheets, and manual attendance. This creates three categories of failure:

### Parent Failures
- Do not know whether the bus has arrived at their stop
- Do not know whether their child boarded
- Do not know whether the child reached school safely
- Do not know whether the child boarded the return trip
- Do not know whether the child reached home
- Result: anxiety, repeated calls to school and drivers

### School Failures
- Cannot see which students boarded vs. missed pickup
- Cannot see which buses are delayed
- Cannot identify poorly performing routes or drivers
- Cannot confirm which students reached school
- Result: no operational accountability

### Transportation Team Failures
- No route visibility during operations
- No systematic attendance tracking
- No driver accountability mechanism
- No structured parent communication
- Result: reactive operations, no data for improvement

---

## 3. Product Goals

### MVP Goals (in priority order)

1. **Safety Visibility** — Parents know their child's status at every step of the journey
2. **Attendance Accountability** — Every boarding and drop is recorded with timestamp and driver attribution
3. **Real-Time Awareness** — Schools and parents can see live bus location and ETA
4. **Operational Structure** — Transportation teams move from WhatsApp/calls to a structured platform
5. **Exception Management** — Missed pickups, delays, and incidents are captured and communicated immediately

### What the MVP Is Not

- Not a routing optimization engine (optimization is post-MVP)
- Not an AI prediction system (post-MVP)
- Not a fee management system
- Not an ERP integration
- Not a multi-region deployment

---

## 4. Target Customers

### MVP Target
- Schools (primary)
- Colleges
- Universities
- Educational trusts
- School groups with multiple campuses
- Residential educational campuses

### Post-MVP Expansion
- Corporate transportation
- Government transportation
- Public transportation
- Logistics organizations

---

## 5. User Roles

### Super Administrator
- Manages institution setup and organization hierarchy
- Controls subscriptions and global settings
- Can see across all institutions

### School Administrator
- Manages students, parents, drivers, routes, buses, stops
- Configures transportation settings for the institution
- Accesses dashboards, reports, and analytics
- Primary day-to-day platform owner

### Transportation Manager
- Monitors daily transportation operations
- Manages driver monitoring and route monitoring
- Handles operational exceptions and incidents
- Does not manage master data (students, routes) — that belongs to Admin

### Driver
- Executes assigned trips
- Records attendance at every stop
- Reports incidents
- Operates primarily offline-first via mobile app

### Parent
- Views child's real-time transportation status
- Tracks live bus location
- Receives automated notifications at each journey milestone
- Read-only — no operational controls

### Student
- Primary entity the platform is built around
- All transportation activities are anchored to the student record

---

## 6. Core Data Entities

### Institution
Represents a school or educational organization. Top-level tenant boundary.

### Campus
A physical location belonging to an institution.

### Academic Year
Used to organize and scope all transportation assignments.

### Student
| Field | Notes |
|---|---|
| Student ID | System-generated |
| Admission Number | School-issued |
| Name | Full name |
| Photo | Used in driver attendance UI |
| Class & Section | Academic grouping |
| Gender | For reporting |
| Status | Active / Inactive / Graduated |
| Pickup Stop | Morning boarding point |
| Drop Stop | Evening alighting point |
| Assigned Route | Route for this academic year |
| Assigned Bus | Bus for this academic year |

### Parent
| Field | Notes |
|---|---|
| Name | |
| Phone Number | Used for notifications |
| Email | |
| Emergency Contact | |
| Relationship | Father / Mother / Guardian |

### Driver
| Field | Notes |
|---|---|
| Employee ID | |
| Name | |
| Phone | |
| License Number | |
| License Expiry | |
| Status | Active / On Leave / Suspended |

### Bus
| Field | Notes |
|---|---|
| Registration Number | |
| Vehicle Number | Display number |
| Capacity | Max students |
| Status | Active / Maintenance / Retired |

### Route
| Field | Notes |
|---|---|
| Route Name | |
| Start Point | Coordinates |
| End Point | School coordinates |
| Stops | Ordered list |
| Total Distance | KM |

### Stop
| Field | Notes |
|---|---|
| Name | |
| Coordinates | Lat/lng |
| Sequence Order | Position in route |

### Trip
Represents one execution of a route (morning or evening). Morning and evening trips are separate records.

| Field | Notes |
|---|---|
| Route | |
| Bus | |
| Driver | |
| Trip Type | Morning / Evening |
| Date | |
| Status | Scheduled / Active / Completed / Cancelled |
| Started At | |
| Completed At | |

### Transportation Attendance
One record per student per trip.

| Field | Notes |
|---|---|
| Student | |
| Trip | |
| Boarding Status | Boarded / Absent / Not Present / Leave Approved |
| Boarding Time | |
| School Arrival Time | |
| Return Boarding Status | |
| Return Boarding Time | |
| Drop Time | |

### Incident
| Field | Notes |
|---|---|
| Trip | |
| Type | Delay / Breakdown / Accident / Route Issue / Other |
| Description | |
| Location | Coordinates |
| Photos | Optional |
| Reported By | Driver |
| Timestamp | |

---

## 7. Student Transportation Lifecycle

This is the core operational flow the entire platform supports.

### Morning Journey

```
[Student waits at stop]
         ↓
[Transportation Manager starts trip via dashboard OR system auto-schedules]
         ↓
[Bus starts route — driver starts trip in app]
         ↓
[Bus approaches stop — parents notified "Bus approaching, ETA X min"]
         ↓
[Bus arrives at stop]
         ↓
[Driver opens attendance screen for that stop]
         ↓
[Driver marks each student: Boarded / Absent / Not Present / Leave Approved]
         ↓
[Attendance saved with timestamp + GPS coordinates]
         ↓
[Parent notified: "Arjun has boarded the bus at Jubilee Hills Stop (8:12 AM)"]
         ↓
[Bus continues to next stop — repeat attendance loop]
         ↓
[Bus arrives at school]
         ↓
[All students marked: Arrived At School]
         ↓
[Parent notified: "Arjun has arrived at school (8:47 AM)"]
         ↓
[Morning trip marked complete]
```

### Evening Journey

```
[School day ends — driver starts evening trip]
         ↓
[Students board at school — driver marks Return Boarding attendance]
         ↓
[Parent notified: "Arjun has boarded the return bus (3:35 PM)"]
         ↓
[Bus departs school — live tracking begins for parents]
         ↓
[Bus approaches each stop — parents notified with ETA]
         ↓
[Student alights at stop — driver marks Dropped]
         ↓
[Parent notified: "Arjun has been dropped at Jubilee Hills Stop (4:18 PM)"]
         ↓
[Evening trip marked complete]
```

### Absence / Exception Flows

**Student marked Absent at pickup stop:**
- Parent notified immediately: "Arjun was not found at the stop. Please contact school."
- Recorded as Absent in attendance

**Student on approved leave:**
- Pre-marked in system by admin
- Driver sees leave status — no notification sent
- Recorded as Leave Approved

**Bus delayed:**
- Driver reports delay incident
- Transportation Manager sees alert on dashboard
- Parents on affected route notified with estimated new ETA

---

## 8. Attendance Workflow Detail

### Pickup Attendance (at each stop, morning trip)

Driver sees list of students assigned to that stop with photos.

For each student, driver selects one of:
- **Boarded** → timestamp recorded, parent notified
- **Absent** → parent notified, admin alerted
- **Not Present** → parent notified (student not found at stop)
- **Leave Approved** → pre-set by admin, auto-resolved

### School Arrival Attendance

Upon reaching school, system records arrival time for all boarded students.
Parent receives: "Arrived At School" notification.

### Return Boarding Attendance (at school, evening trip)

Before departure, driver marks each student:
- **Boarded Return Trip** → parent notified
- **Not Boarding** → stays at school (parent notified, admin alerted)

### Home Drop Attendance (at each stop, evening trip)

At each stop, driver marks each student:
- **Dropped** → timestamp recorded, parent notified

---

## 9. Parent Experience

### Student Status States (visible to parent)

| Status | Meaning |
|---|---|
| Waiting For Pickup | Bus not yet at their stop |
| Bus Approaching | Bus within proximity threshold |
| On Bus | Student marked Boarded |
| Arrived At School | School arrival recorded |
| Returning Home | Evening trip started, student boarded |
| Dropped Home | Drop recorded at their stop |
| Absent | Marked absent at pickup |
| Leave | Approved leave — not traveling today |

### Parent Notification Events

| Event | Message Example |
|---|---|
| Trip started | "Bus 47 has started its route. Estimated arrival at your stop: 8:20 AM" |
| Bus approaching stop | "Bus 47 is 2 stops away — arriving in approximately 8 minutes" |
| Student boarded | "Arjun has boarded Bus 47 at Jubilee Hills Stop (8:12 AM)" |
| Student absent | "Arjun was not found at the stop. The bus has moved on." |
| Arrived at school | "Arjun has arrived at school (8:47 AM)" |
| Evening trip started | "Bus 47 has started the return trip. Arjun is on the bus." |
| Approaching drop stop | "Bus 47 is approximately 10 minutes from your stop" |
| Student dropped | "Arjun has been dropped at Jubilee Hills Stop (4:18 PM)" |
| Delay | "Bus 47 is running 15 minutes late due to traffic on Jubilee Hills Road" |

### Live Tracking (Parent App)

- Map showing current bus position
- Route path with completed vs. remaining segments
- ETA to student's stop
- Next stop indicator

---

## 10. Driver Experience

### Driver App Navigation

| Screen | Purpose |
|---|---|
| Dashboard | Today's trips, status summary |
| Today's Trips | Morning and evening trip cards |
| Active Trip | Current trip with stop-by-stop navigation |
| Attendance | Student list per stop |
| Route Details | Full stop sequence with student counts |
| Incident Reporting | Submit delay, breakdown, or accident |
| Profile | Driver details, assigned vehicle |

### Trip Execution Flow

```
Driver opens app → sees today's trips
         ↓
Driver taps "Start Trip"
         ↓
Live tracking begins (GPS transmitted every N seconds)
         ↓
App shows next stop with student count
         ↓
Driver arrives at stop → taps "At Stop"
         ↓
Attendance screen opens for that stop
         ↓
Driver marks each student (Boarded / Absent / etc.)
         ↓
Driver taps "Depart Stop" → moves to next stop
         ↓
Repeat for all stops
         ↓
Driver arrives at school → marks school arrival
         ↓
Trip marked complete
```

### Offline Requirement

The driver app must operate without internet. GPS coordinates and attendance actions are queued locally and synced when connectivity returns. This is non-negotiable — drivers operate in areas with poor connectivity.

---

## 11. Transportation Manager Experience

### Live Operations Dashboard

| Panel | Content |
|---|---|
| Fleet Overview | Active buses on map, each bus color-coded by status |
| Active Routes | List of routes with progress indicators |
| Driver Status | Which drivers are on trip, which are delayed |
| Exceptions | Missed pickups, delayed routes, active incidents |

### Monitoring Actions

- View any active trip in detail
- View live bus location
- Contact driver directly
- Acknowledge or resolve an incident
- Notify parents about a delay (system-generated or manual)

---

## 12. School Administrator Experience

### Admin Portal Navigation

| Section | Purpose |
|---|---|
| Dashboard | Transportation overview for today |
| Students | Student master data and transportation assignments |
| Parents | Parent contacts and notification history |
| Drivers | Driver management and assignment |
| Buses | Vehicle fleet management |
| Routes | Route and stop configuration |
| Trips | Trip scheduling and history |
| Live Operations | Real-time map view (same as transportation manager) |
| Attendance | Historical attendance records |
| Incidents | Incident log and resolution |
| Reports | Analytics and exports |
| Settings | Institution, notification, and system settings |

### Admin Dashboard Metrics

**Transportation Overview**
- Total Students Enrolled in Transportation
- Students Active Today
- Buses Active Today
- Routes Active Today
- Drivers On Duty

**Student Safety Overview** (live, morning trip)
- Students Picked Up (count + %)
- Students Arrived At School (count + %)
- Students Returning (evening)
- Students Dropped Home (evening)

**Exceptions Overview**
- Missed Pickups today
- Absent Students today
- Delayed Routes (currently)
- Active Incidents

**Live Operations Map**
- All active buses
- Route progress per bus
- Delay indicators

---

## 13. MVP Modules

| Module | Scope |
|---|---|
| Student Management | Create, edit, assign to route/stop/bus |
| Parent Management | Create, link to student, emergency contacts |
| Driver Management | Create, assign to routes/trips |
| Bus Management | Create, set capacity, manage status |
| Route Management | Create routes, add stops, set sequence |
| Stop Management | Create stops with coordinates |
| Student Assignment | Assign student to route + pickup stop + drop stop |
| Trip Management | Schedule and manage morning/evening trips |
| Live Tracking | GPS transmission from driver app, display on map |
| Attendance Management | All four attendance stages |
| Incident Management | Report, view, resolve incidents |
| Notifications | All notification events per lifecycle |
| Reporting | Student, route, attendance, and safety reports |

---

## 14. Non-Functional Requirements

### Real-Time Updates
Transportation location and status must update continuously. Target: GPS update interval of 5–10 seconds during active trips.

### Reliability
Tracking must tolerate temporary network interruptions. Driver app continues operating offline. Data syncs on reconnect.

### Offline Capability
Driver mobile application must:
- Queue attendance actions offline
- Store GPS track offline
- Sync all queued data on reconnect
- Never lose an attendance record due to connectivity

### Scalability
Architecture must support single school through multi-campus school groups without redesign. Tenant isolation is mandatory from day one.

### Security
- Role-based access: users only see data relevant to their role
- Parents see only their own children
- Drivers see only their assigned trips and students
- Admin and Transportation Manager are scoped to their institution

---

## 15. Design Principles

Every screen, workflow, and notification should reinforce:

1. **Student-centric** — The student is always the anchor entity. Never build a screen that treats the bus as the primary entity.
2. **Trust through transparency** — Parents must never be left wondering. If we don't know the status, say so. Never show stale data as current.
3. **Accountability** — Every attendance action has a driver, a timestamp, and a GPS location. No anonymous records.
4. **Simplicity for drivers** — Driver UI must work on a budget Android phone with one hand while standing outside a bus. Large tap targets, minimal steps, clear student photos.
5. **Actionable alerts** — Notifications tell parents exactly what happened, when, and where. No vague messages.

---

## 16. Future Scope (Post-MVP)

Not in scope now. Do not design for these:

- AI-powered ETA prediction
- Route optimization engine
- Driver performance analytics
- Student behavior analytics
- RFID / QR / Face recognition attendance
- Digital transport passes
- WhatsApp notifications
- School ERP integrations
- Fee management
- Multi-language support
- Multi-region deployments
- Corporate / government transportation

---

## 17. Application Alignment Summary

| Application | Primary Users | Core Job |
|---|---|---|
| `apps/web` | Super Admin, School Admin, Transportation Manager | Configure, monitor, manage, report |
| `apps/mobile-driver` | Drivers | Execute trips, record attendance, report incidents |
| `apps/mobile-parent` | Parents | Track child, receive notifications |
| `apps/api` | All apps | Single source of truth for all data and business logic |

Every feature built in any application must map to a module in Section 13, serve a user role in Section 5, and respect the student lifecycle in Section 7.
