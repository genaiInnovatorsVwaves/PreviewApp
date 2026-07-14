import type { DocumentGalleryData } from "../types";

export const facilitiesSchedulerDocs: DocumentGalleryData = {
  repoUrl: "https://github.com/codesingularity/facilities-scheduler",
  repoName: "FACILITIESSCHEDULER",
  processSteps: [
    { label: "Cloning repository", description: "Fetching source code from remote" },
    { label: "Parsing codebase", description: "Reading and analyzing file structure" },
    { label: "Building dependency graph", description: "Mapping relationships and dependencies" },
    { label: "Extracting architecture", description: "Identifying patterns and system design" },
    { label: "Generating documentation", description: "Writing structured docs from analysis" },
  ],
  events: [
    "Cloned repository — 214 files across 26 modules, 61,340 lines of TypeScript",
    "Parsed NestJS project structure, module graph, and Docker Compose topology",
    "Detected Redis client usage in availability-lock-service — flagged as distributed locking pattern",
    "Detected Microsoft Graph SDK and Google Calendar API clients in calendar-sync-adapter",
    "Built module dependency graph across 26 modules, 6 external integrations",
    "Extracted layered architecture: API layer, orchestration layer, domain services, persistence, adapters",
    "Generated Business Requirements from ticket history and stakeholder references in commit messages",
    "Generated Product Requirements from route handlers and DTO validation schemas",
    "Generated High-Level Design and component interaction diagram",
    "Generated Data Flow Diagram tracing booking-request lifecycle end to end",
    "Generated Low-Level Design across booking-orchestrator, availability-lock-service, conflict-resolver",
    "Generated API Reference from 34 discovered REST route handlers",
    "Generated Test Plan and 47 discrete Test Cases from existing Jest/Supertest suite",
    "Generated Traceability Matrix and per-module Coverage report from lcov output",
    "Generated Tutorial and Provenance record",
  ],
  documents: [
    {
      key: "hld",
      icon: "hld",
      title: "High level design",
      description: "Architecture overview, major modules, and system boundaries.",
      readMinutes: 9,
      sections: [
        {
          id: "1",
          title: "Executive Summary",
          level: 1,
          paragraphs: [
            "Facilities Scheduler is the Workplace Technology team's system of record for room and shared-resource booking across the corporate campus's four buildings — West Tower, East Wing, North Annex, and Riverside Campus — serving roughly 1,900 employees and processing approximately 7,400 bookings per month.",
            "The system was reverse-engineered directly from its source repository: a NestJS (Node.js/TypeScript) backend on PostgreSQL, with Redis used for real-time availability locking and Microsoft Graph plus Google Calendar APIs used for two-way calendar synchronization. Before this system existed, double-bookings ran to roughly 140 incidents per month across the campus, driven almost entirely by race conditions between the internal booking form and each building's native calendar client; the distributed-locking design documented below is a direct response to that failure mode.",
            "26 modules were identified via static analysis of the NestJS module graph, organized into four layers: an API layer (controllers and DTO validation), an orchestration layer (`booking-orchestrator`), a set of domain services (`availability-lock-service`, `conflict-resolver`, `utilization-analytics-service`), and a persistence/adapter layer (`calendar-sync-adapter`, TypeORM repositories).",
          ],
        },
        {
          id: "2",
          title: "Architecture Overview",
          level: 1,
          paragraphs: [
            "The booking flow is orchestrated rather than handled inline in a controller: `booking-orchestrator` receives a validated `CreateBookingDto` (roomName, requester, bookingDate, timeSlot, purpose) and coordinates three collaborators before committing anything to Postgres.",
            "`availability-lock-service` acquires a short-lived Redis distributed lock keyed on `{roomName}:{bookingDate}:{timeSlot}` (using a Redlock-style algorithm with a 5-second TTL and automatic renewal for slow requests) — this is the mechanism that eliminated the double-booking race condition that existed prior to this rewrite.",
            "With the lock held, `conflict-resolver` checks two things in parallel: existing rows in the `bookings` table for that room/date/slot, and — via `calendar-sync-adapter` — any conflicting event already sitting on that room's resource mailbox in Microsoft Graph or Google Calendar (rooms provisioned before 2025 sync through Google Workspace; rooms in Riverside Campus, provisioned later, sync through Microsoft 365). Only if both checks clear does `booking-orchestrator` commit the row and release the lock.",
          ],
        },
        {
          id: "3",
          title: "Key Design Decisions",
          level: 1,
          paragraphs: [
            "Distributed locking was chosen over a database-level unique constraint on (room, date, slot) because slot boundaries are not fixed-width — the `timeSlot` field is a free-text range (e.g. \"10:00 AM – 11:00 AM\") — so overlap detection requires a compare-and-check step that a unique index alone cannot express; the lock protects that check-then-write window.",
            "Calendar sync is asynchronous and best-effort: `calendar-sync-adapter` dispatches the invite after the booking is already committed and confirmed to the requester, rather than holding the HTTP response open on an external API call. A `calendar_sync_log` table tracks delivery status per booking so failed syncs can be retried without re-running the booking flow.",
          ],
        },
        {
          id: "4",
          title: "Module Map",
          level: 2,
          paragraphs: [
            "Core modules: `booking-orchestrator`, `availability-lock-service`, `conflict-resolver`, `calendar-sync-adapter`, `utilization-analytics-service`, `no-show-tracker`, `room-catalog-service`, `notification-dispatcher`. Supporting modules: `auth`, `audit-log`, `admin-console-api`, `reporting-export`.",
          ],
        },
      ],
    },
    {
      key: "lld",
      icon: "lld",
      title: "Low level design",
      description: "Detailed components, interfaces, and implementation structure.",
      readMinutes: 11,
      sections: [
        {
          id: "1",
          title: "Module Breakdown",
          level: 1,
          paragraphs: [
            "`booking-orchestrator` exposes a single public entry point, `BookingOrchestratorService.createBooking(dto: CreateBookingDto): Promise<Booking>`, and is the only module permitted to write to the `bookings` table — every other module that needs booking state reads through `BookingQueryService`, keeping write-path invariants (lock-then-check-then-commit) enforceable in one place.",
            "`availability-lock-service` implements `RoomAvailabilityLock { acquire(roomName: string, bookingDate: string, timeSlot: string): Promise<LockHandle>; release(handle: LockHandle): Promise<void> }`, backed by Redis `SET NX PX` with a 5-second TTL; a background renewal timer extends the TTL if `conflict-resolver`'s checks are still in flight past 3 seconds, preventing premature lock expiry under load.",
            "`conflict-resolver` implements `BookingConflictResolver { check(request: BookingRequest): Promise<ConflictResult> }`, which fans out to an internal Postgres query and the external `CalendarSyncAdapter.getEvents(roomName, dateRange)` call concurrently via `Promise.all`, then reconciles both result sets against the requested `timeSlot` using an interval-overlap comparison.",
          ],
        },
        {
          id: "2",
          title: "Data Access Layer",
          level: 1,
          paragraphs: [
            "Persistence uses TypeORM repositories behind a thin `BookingRepository` / `RoomRepository` abstraction. Four core tables were identified: `rooms` (roomName, building, capacity, equipment, status), `bookings` (roomName FK, requester, bookingDate, timeSlot, purpose, status, createdAt), `booking_conflicts` (an append-only audit of every conflict `conflict-resolver` rejected, used for the no-show/false-positive analysis in `utilization-analytics-service`), and `calendar_sync_log` (bookingId FK, provider, syncStatus, lastAttemptAt, retryCount).",
            "Room and booking status are modeled as Postgres enums rather than free-text columns (`room_status_enum`: Available, In Use, Maintenance, Out of Service; `booking_status_enum`: Pending, Confirmed, Completed, Cancelled) so invalid states are rejected at the database layer as a second line of defense behind DTO validation.",
          ],
        },
        {
          id: "3",
          title: "Error Handling",
          level: 1,
          paragraphs: [
            "Lock-acquisition failures (another request holds the lock past a 2-second wait) surface as `409 Conflict` with a `LOCK_CONTENTION` error code, distinct from a genuine double-booking rejection (`409 Conflict` / `SLOT_UNAVAILABLE`) so the client UI can distinguish \"try again\" from \"pick another slot.\"",
            "Calendar sync failures never fail the booking itself — `calendar-sync-adapter` catches provider errors, writes a `Failed` row to `calendar_sync_log`, and emits a `calendar.sync.failed` event picked up by a retry worker that attempts redelivery on an exponential backoff (up to 5 attempts over 24 hours) before paging the IT Service Desk queue.",
          ],
        },
      ],
    },
    {
      key: "brd",
      icon: "brd",
      title: "Business requirements",
      description: "Business goals, stakeholders, and functional requirements.",
      readMinutes: 8,
      sections: [
        {
          id: "1",
          title: "Business Goals",
          level: 1,
          paragraphs: [
            "Room and shared-resource booking service reverse-engineered from its Git repository into a full documentation set — scheduling rules, conflict resolution, and calendar integration are now traceable end to end. The originating business problem was twofold: double-bookings were running at roughly 140 per month campus-wide, each costing real employee time and creating a trust problem with the booking system severe enough that several teams had reverted to shared spreadsheets; and Facilities Planning had no reliable utilization data to justify space decisions (which rooms to keep, consolidate, or retrofit).",
            "Since rollout, distributed locking has driven double-booking incidents to near zero, and utilization dashboards fed by `utilization-analytics-service` are credited with an 18% reduction in underused meeting space across the West Tower and North Annex floors, informing a floor-consolidation decision in early 2026.",
          ],
        },
        {
          id: "2",
          title: "Stakeholders",
          level: 1,
          paragraphs: [
            "Primary stakeholders: the VP of Workplace Experience (owns the business case and the space-utilization mandate), the Facilities Director (owns building operations and room inventory — capacity, equipment, maintenance status), and the IT Service Desk Manager (owns calendar-integration incidents and the escalation path when `calendar-sync-adapter` retries are exhausted). Day-to-day users are any employee booking a room and the Workplace Technology engineering team (~5 engineers) who operate the service.",
          ],
        },
        {
          id: "3",
          title: "Functional Requirements",
          level: 1,
          paragraphs: [
            "FR-1: The system must prevent two confirmed bookings from overlapping on the same room, date, and time slot, including bookings made concurrently within milliseconds of each other. FR-2: Every booking must reflect its true state relative to any conflicting event on the room's external calendar (Google Workspace or Microsoft 365, depending on when the room was provisioned). FR-3: Facilities Planning must be able to see room utilization by building and by room over any rolling window without engaging engineering. FR-4: No-show bookings must be detected and the room released automatically rather than sitting falsely occupied.",
          ],
        },
      ],
    },
    {
      key: "prd",
      icon: "prd",
      title: "Product requirements",
      description: "Product scope, user stories, and acceptance criteria.",
      readMinutes: 9,
      sections: [
        {
          id: "1",
          title: "Scope",
          level: 1,
          paragraphs: [
            "In scope: room search and booking across all 14 tracked rooms spanning West Tower, East Wing, North Annex, and Riverside Campus; conflict-free booking creation, cancellation, and status lifecycle (Pending → Confirmed → Completed / Cancelled); two-way calendar sync; no-show detection; and utilization reporting for Facilities Planning. Out of scope: desk/hoteling reservations (owned by a separate `desk-booking-service`) and visitor badge issuance.",
          ],
        },
        {
          id: "2",
          title: "User Stories",
          level: 1,
          paragraphs: [
            "As an employee, I want to book \"Meridian Conference Room 4B\" for a specific `timeSlot` and have the system reject the request immediately if that slot is already held — either internally or on the room's external calendar — so I never show up to a double-booked room. Acceptance: a concurrent request for the same `roomName` + `bookingDate` + `timeSlot` returns `409 SLOT_UNAVAILABLE` for exactly one of the two requests, never both accepted and never both rejected.",
            "As a requester, I want to cancel my own booking and have the room immediately show as available to others. Acceptance: `status` transitions from `Confirmed` to `Cancelled`, the Redis lock (if still held from creation) is released, and the calendar invite is retracted via `calendar-sync-adapter` within the next sync cycle.",
            "As the Facilities Director, I want to mark a room `Maintenance` or `Out of Service` and have all future booking attempts against it rejected with a clear reason, without needing to cancel bookings that were already confirmed before the status change. Acceptance: room-status changes are non-retroactive — only new booking attempts are blocked.",
            "As a room owner, I want no-show bookings automatically released after a grace period so the room isn't held hostage by someone who never checked in. Acceptance: a `Confirmed` booking with no check-in signal within 15 minutes of `timeSlot` start is auto-transitioned to `Cancelled` by `no-show-tracker` and the room becomes bookable again.",
          ],
        },
      ],
    },
    {
      key: "feature",
      icon: "feature",
      title: "Feature specification",
      description: "Feature behavior, inputs, outputs, and edge cases.",
      readMinutes: 10,
      sections: [
        {
          id: "1",
          title: "Distributed Booking Lock",
          level: 1,
          paragraphs: [
            "Every booking attempt acquires a Redis lock scoped to `{roomName}:{bookingDate}:{timeSlot}` before any read of existing bookings occurs, closing the check-then-write race that produced the pre-rewrite double-booking rate. Lock TTL is 5 seconds with a single renewal window; if `conflict-resolver`'s external calendar check is still pending past 3 seconds (typically a slow Microsoft Graph response), the TTL is extended once rather than allowing the lock to expire mid-check.",
          ],
        },
        {
          id: "2",
          title: "No-Show Auto-Cancellation",
          level: 1,
          paragraphs: [
            "`no-show-tracker` polls `Confirmed` bookings whose `timeSlot` start has passed by more than 15 minutes with no check-in event recorded (check-in is a lightweight badge-tap or app confirmation integrated separately). Matching bookings transition to `Cancelled`, freeing the room and triggering a calendar retraction — this is the mechanism behind the 18% underused-space reduction, since it surfaces true occupancy rather than nominal booking counts.",
          ],
        },
        {
          id: "3",
          title: "Capacity-Aware Room Suggestion",
          level: 1,
          paragraphs: [
            "When a requested room is unavailable for the desired slot, the search endpoint returns alternative rooms in the same building filtered by `capacity >= requestedCapacity` and `status = Available`, ranked by capacity proximity so a 12-person meeting isn't defaulted into the 150-seat Riverside Auditorium.",
          ],
        },
        {
          id: "4",
          title: "Edge Cases",
          level: 2,
          paragraphs: [
            "Overlapping-but-not-identical time slots (e.g. an existing 10:00–11:00 AM booking against a new 10:30–11:30 AM request) are caught by `conflict-resolver`'s interval-overlap comparison, not just exact-match checks. A room whose external calendar is unreachable (provider outage) fails the booking closed by default — the request is rejected with `CALENDAR_CHECK_UNAVAILABLE` rather than silently allowing a booking that might collide.",
          ],
        },
      ],
    },
    {
      key: "api",
      icon: "api",
      title: "API reference",
      description: "Endpoints, payloads, authentication, and error contracts.",
      readMinutes: 13,
      sections: [
        {
          id: "1",
          title: "Authentication",
          level: 1,
          paragraphs: [
            "All endpoints require a bearer token issued by the corporate SSO provider (Okta), validated by a shared `AuthGuard` at the NestJS module boundary. Admin-console endpoints (room status changes, maintenance flags) additionally require the `facilities-admin` role claim; unauthorized attempts return `403 Forbidden` with an error envelope naming the missing role.",
          ],
        },
        {
          id: "2",
          title: "Core Endpoints",
          level: 1,
          paragraphs: [
            "`GET /api/v1/rooms` — list all rooms with current `status`, `building`, and `capacity`; supports `?building=` and `?minCapacity=` filters. `GET /api/v1/rooms/{roomName}/availability?date=&slot=` — returns whether the room is free for the given date/slot, checking both internal bookings and the synced external calendar. `POST /api/v1/bookings` — creates a booking (body: roomName, requester, bookingDate, timeSlot, purpose); acquires the distributed lock internally and returns `201` with the created `Booking`, or `409` on conflict. `POST /api/v1/bookings/{id}/cancel` — cancels a Confirmed or Pending booking and releases the room. `GET /api/v1/bookings?requester=&status=&building=` — search/filter bookings. `PATCH /api/v1/rooms/{roomName}/status` — admin-only room status change (Available / In Use / Maintenance / Out of Service).",
            "`GET /api/v1/analytics/utilization?building=&range=` — aggregated utilization percentage by room or building over a date range, the endpoint backing the Facilities Planning dashboards. `GET /api/v1/analytics/no-shows?range=` — no-show rate by room. `POST /api/v1/bookings/{id}/checkin` — records a check-in signal, suppressing no-show auto-cancellation for that booking. `GET /api/v1/calendar-sync/status/{bookingId}` — surfaces the current `calendar_sync_log` status for a given booking, used by the IT Service Desk when triaging \"my invite never arrived\" tickets.",
          ],
        },
        {
          id: "3",
          title: "Error Contract",
          level: 2,
          paragraphs: [
            "Errors return `{ code: string, message: string, requestId: string }`. Known codes include `SLOT_UNAVAILABLE`, `LOCK_CONTENTION`, `CALENDAR_CHECK_UNAVAILABLE`, `ROOM_NOT_BOOKABLE` (room is Maintenance or Out of Service), and `VALIDATION_ERROR` (field-level DTO validation failure, with a `fields` array naming each invalid property).",
          ],
        },
      ],
    },
    {
      key: "testplan",
      icon: "testplan",
      title: "Test plan",
      description: "Test scenarios, coverage targets, and validation steps.",
      readMinutes: 9,
      sections: [
        {
          id: "1",
          title: "Test Strategy",
          level: 1,
          paragraphs: [
            "Testing is layered: Jest unit tests around `conflict-resolver`'s interval-overlap logic and `availability-lock-service`'s lock lifecycle in isolation (Redis mocked); Supertest integration tests around the booking API with a real Postgres test container and a real Redis instance to validate actual locking behavior under contention; and a smaller set of end-to-end concurrency tests that fire simultaneous booking requests at the same slot to verify exactly one succeeds.",
          ],
        },
        {
          id: "2",
          title: "Coverage Targets",
          level: 1,
          paragraphs: [
            "`booking-orchestrator`, `availability-lock-service`, and `conflict-resolver` — the modules responsible for the correctness guarantee the system exists to provide — target 90%+ statement coverage. `calendar-sync-adapter` targets 80% given its dependency on two external, occasionally-flaky third-party SDKs. `admin-console-api` and `reporting-export`, lower change-frequency surfaces, are covered more lightly at 65-70%.",
          ],
        },
        {
          id: "3",
          title: "Concurrency Test Strategy",
          level: 1,
          paragraphs: [
            "The core regression suite for this system is its concurrency tests, since the business case for the rewrite was eliminating a race condition: `TC-LOCK-007` and related cases fire N simultaneous requests (N = 2 through 25) at an identical room/date/slot and assert exactly one `201` and N-1 `409 SLOT_UNAVAILABLE` responses, run in CI on every merge to `main`.",
          ],
        },
      ],
    },
    {
      key: "testcases",
      icon: "testcases",
      title: "Test cases",
      description: "Concrete test case specifications derived from the test plan, with inputs, steps, and expected results.",
      readMinutes: 11,
      sections: [
        {
          id: "1",
          title: "Happy Path Cases",
          level: 1,
          paragraphs: [
            "TC-BOOK-001: Book an Available room for a free slot — POST /api/v1/bookings with a valid, non-conflicting payload returns 201 and a Booking with status Pending, then Confirmed once the lock is released and no conflict is found. TC-BOOK-004: Cancel a Confirmed booking — POST /bookings/{id}/cancel transitions status to Cancelled and the room reappears in GET /rooms/{roomName}/availability as free for that slot. TC-CAL-003: Booking successfully syncs to an external calendar — after a booking is Confirmed, calendar_sync_log shows syncStatus = Synced within one retry cycle for both the Google Workspace and Microsoft 365 provider paths.",
          ],
        },
        {
          id: "2",
          title: "Concurrency & Conflict Cases",
          level: 1,
          paragraphs: [
            "TC-LOCK-007: Concurrent booking requests for the same room/date/slot — of 10 simultaneous POST /api/v1/bookings requests against Meridian Conference Room 4B for the same slot, exactly 1 returns 201 and 9 return 409 SLOT_UNAVAILABLE; no partial writes occur. TC-LOCK-011: Lock contention under slow external calendar check — with the Microsoft Graph mock delayed 4 seconds, the lock TTL renewal keeps the lock held through conflict-resolver's check without a second request slipping through. TC-CONF-002: Internal booking blocked by external calendar conflict — a room with no internal booking record but an existing event on its synced external calendar rejects a new booking request for the overlapping slot with 409 SLOT_UNAVAILABLE.",
          ],
        },
        {
          id: "3",
          title: "Negative Cases",
          level: 1,
          paragraphs: [
            "TC-VAL-005: Missing required field — POST /api/v1/bookings without `requester` returns 400 VALIDATION_ERROR naming `requester` in the fields array; no row is written. TC-ROOM-009: Booking attempt against a Maintenance room — returns 409 ROOM_NOT_BOOKABLE and no lock is acquired. TC-NOSHOW-014: No check-in within grace period — a Confirmed booking with no /checkin call within 15 minutes of timeSlot start auto-transitions to Cancelled and the room becomes bookable.",
          ],
        },
      ],
    },
    {
      key: "dataflow",
      icon: "dataflow",
      title: "Data flow",
      description: "Data movement across services, stores, and integrations.",
      readMinutes: 7,
      sections: [
        {
          id: "1",
          title: "Primary Booking Path",
          level: 1,
          paragraphs: [
            "A booking request enters through the API layer, is DTO-validated, and handed to `booking-orchestrator`. `booking-orchestrator` calls `availability-lock-service.acquire()` to take the Redis lock, then `conflict-resolver.check()` which queries Postgres for existing `bookings` rows and, concurrently, calls `calendar-sync-adapter.getEvents()` against Microsoft Graph or Google Calendar depending on the room's provider. If both checks clear, `booking-orchestrator` writes the new row to `bookings` (status Pending → Confirmed) and releases the lock.",
            "After commit, an async event triggers `calendar-sync-adapter.createEvent()`, which dispatches the invite to the external provider and writes a row to `calendar_sync_log`. Separately, `notification-dispatcher` sends the requester a confirmation, and `utilization-analytics-service` increments the relevant building/room aggregate used by the Facilities Planning dashboards.",
          ],
        },
        {
          id: "2",
          title: "No-Show Detection Path",
          level: 2,
          paragraphs: [
            "`no-show-tracker` runs on a scheduled interval, querying `Confirmed` bookings whose `timeSlot` has started without a matching `/checkin` event, transitioning matches to `Cancelled` and emitting the same release path a manual cancellation would trigger — including calendar retraction and the analytics aggregate update.",
          ],
        },
      ],
    },
    {
      key: "traceability",
      icon: "traceability",
      title: "Traceability matrix",
      description: "Mapping from requirements to design, code, and tests.",
      readMinutes: 8,
      sections: [
        {
          id: "1",
          title: "Coverage Mapping",
          level: 1,
          paragraphs: [
            "FR-1 (prevent overlapping confirmed bookings) → `availability-lock-service` + `conflict-resolver` → TC-LOCK-007, TC-LOCK-011. FR-2 (reflect true state relative to external calendar) → `calendar-sync-adapter` → TC-CAL-003, TC-CONF-002. FR-3 (utilization visibility for Facilities Planning) → `utilization-analytics-service` + `GET /api/v1/analytics/utilization` → covered by the reporting-export integration suite. FR-4 (automatic no-show release) → `no-show-tracker` → TC-NOSHOW-014.",
            "Every functional requirement identified during analysis maps to at least one design section in this document set and one corresponding test case, closing the loop from stated business intent through to a concrete, currently-passing verification.",
          ],
        },
      ],
    },
    {
      key: "coverage",
      icon: "coverage",
      title: "Coverage",
      description: "Documentation and code coverage across the codebase.",
      readMinutes: 6,
      sections: [
        {
          id: "1",
          title: "Per-Module Coverage",
          level: 1,
          paragraphs: [
            "`availability-lock-service`: 94% statements. `conflict-resolver`: 91% statements. `booking-orchestrator`: 90% statements. `calendar-sync-adapter`: 82% statements (external SDK boundaries are integration-tested rather than unit-mocked at every branch). `no-show-tracker`: 88%. `admin-console-api`: 68%. `reporting-export`: 64%. Overall repository statement coverage: 79%.",
          ],
        },
        {
          id: "2",
          title: "Documentation Coverage",
          level: 1,
          paragraphs: [
            "Core booking-path modules are fully documented at both the HLD and LLD level; `admin-console-api` and `reporting-export` have partial LLD coverage, flagged here for follow-up since they change less frequently and were deprioritized during the original documentation pass.",
          ],
        },
      ],
    },
    {
      key: "summary",
      icon: "summary",
      title: "Generation summary",
      description: "Summarizes what is covered across all related documents in a single consolidated view.",
      readMinutes: 5,
      sections: [
        {
          id: "1",
          title: "What Was Generated",
          level: 1,
          paragraphs: [
            "This pass produced 14 documents covering architecture, requirements, API surface, test strategy, and a getting-started tutorial, all derived from static analysis of Facilities Scheduler — 26 modules, 214 files, 61,340 lines of TypeScript, 34 REST endpoints, and 47 discrete test cases across the Jest/Supertest suite. The distributed-locking design (Redis-backed, protecting the check-then-write window in `availability-lock-service`) and the dual-provider calendar sync (Microsoft Graph for Riverside Campus, Google Calendar for the other three buildings) were the two architectural decisions most central to this system's business case and are cross-referenced throughout the HLD, LLD, Feature Specification, and Test Plan.",
          ],
        },
      ],
    },
    {
      key: "provenance",
      icon: "provenance",
      title: "Provenance",
      description: "Track the origin of data and outputs from start to finish, with complete visibility into how each document was generated.",
      readMinutes: 5,
      sections: [
        {
          id: "1",
          title: "Generation Trail",
          level: 1,
          paragraphs: [
            "Every document links back to the repository commit (`main` at time of analysis), the specific file paths inspected (e.g. `src/booking/booking-orchestrator.service.ts`, `src/availability/availability-lock.service.ts`, `src/calendar/calendar-sync.adapter.ts`), and the analysis pass that produced it — static module-graph extraction for the HLD, TypeORM entity introspection for the data model in the LLD, route-handler and DTO scanning for the API Reference, and lcov coverage output for the Coverage report — so any claim in this documentation set can be traced back to source.",
          ],
        },
      ],
    },
    {
      key: "tutorial",
      icon: "tutorial",
      title: "Tutorial",
      description: "A getting-started walkthrough for running, configuring, and extending the application locally.",
      readMinutes: 8,
      sections: [
        {
          id: "1",
          title: "Getting Started",
          level: 1,
          paragraphs: [
            "Clone the repository and run `docker-compose up -d` to start local PostgreSQL and Redis instances — both are required, since `availability-lock-service` will refuse to start without a reachable Redis connection. Copy `.env.example` to `.env` and fill in placeholder Microsoft Graph and Google Calendar API credentials (sandbox credentials are sufficient for local development; calendar sync gracefully no-ops without valid credentials, logging a warning rather than failing the booking flow). Run `npm install` then `npm run start:dev` to boot the API on port 3000 with hot reload.",
            "Run `npm run seed` to populate the local database with the 14 tracked rooms across West Tower, East Wing, North Annex, and Riverside Campus, matching the current production room catalog.",
          ],
        },
        {
          id: "2",
          title: "Making a Booking Locally",
          level: 1,
          paragraphs: [
            "With the server running, `POST http://localhost:3000/api/v1/bookings` with `{ \"roomName\": \"Meridian Conference Room 4B\", \"requester\": \"Test User\", \"bookingDate\": \"2026-07-25\", \"timeSlot\": \"10:00 AM – 11:00 AM\", \"purpose\": \"Local test\" }` and a valid local auth token (see `npm run dev:token` to mint one against the local Okta mock) should return `201` with the created booking. Repeating the same request immediately should return `409 SLOT_UNAVAILABLE`, confirming the distributed lock and conflict check are both wired up correctly in your local environment.",
          ],
        },
        {
          id: "3",
          title: "Making a Change",
          level: 1,
          paragraphs: [
            "Locate the relevant module using the module map in the High-Level Design, add or update tests alongside the change — concurrency-sensitive changes to `availability-lock-service` or `conflict-resolver` should include a corresponding case in the `TC-LOCK-*` family — and verify `npm run test:integration` passes locally (this spins up the same Postgres/Redis test containers CI uses) before opening a pull request.",
          ],
        },
      ],
    },
  ],
};
