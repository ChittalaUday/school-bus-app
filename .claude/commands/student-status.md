# Student Status Reference

Show the canonical student transport status states, their triggers, and the parent-facing labels. Use this when building any UI that displays student status or writing code that transitions status.

**Usage:** `/student-status` (no arguments)

---

Read `docs/product/PRODUCT.md` sections 8 and 9, then display:

## Student Transport Status States

| Internal Status | Parent Display | Trigger |
|---|---|---|
| `WAITING_FOR_PICKUP` | Waiting For Pickup | Trip started, student not yet boarded |
| `BUS_APPROACHING` | Bus Approaching | Bus within proximity threshold of student's stop |
| `ON_BUS` | On Bus | Student marked Boarded at pickup stop |
| `ARRIVED_AT_SCHOOL` | Arrived At School | School arrival recorded |
| `RETURNING_HOME` | Returning Home | Evening trip started, student marked Boarded Return Trip |
| `DROPPED_HOME` | Dropped Home | Student marked Dropped at their home stop |
| `ABSENT` | Absent | Marked Absent at pickup stop |
| `ON_LEAVE` | On Leave | Leave Approved pre-set by admin |

## Attendance Status Options Per Stage

| Stage | Valid Statuses |
|---|---|
| Pickup (at stop) | Boarded, Absent, Not Present, Leave Approved |
| School Arrival | Arrived At School (auto for all Boarded) |
| Return Boarding | Boarded Return Trip, Not Boarding |
| Home Drop | Dropped |

## Notification Events

List all notification events from PRODUCT.md section 9 with example message copy.

---

These are the only valid status values in the entire system. Any code that introduces a new status or label not in this table must update `packages/shared` and this reference first.
