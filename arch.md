# Govexa - Technical Decisions

## Backend

| Technology      | Purpose                           |
| --------------- | --------------------------------- |
| Node.js         | Runtime                           |
| TypeScript      | Programming language              |
| Fastify         | API framework                     |
| Prisma          | Database ORM                      |
| Zod             | Validation and schema definitions |
| JWT             | Authentication                    |
| Swagger/OpenAPI | API documentation                 |

---

## Database

| Technology | Purpose                              |
| ---------- | ------------------------------------ |
| PostgreSQL | Primary database                     |
| PostGIS    | Geospatial queries and location data |

---

## Maps & Routing

| Technology            | Purpose                                        |
| --------------------- | ---------------------------------------------- |
| OpenStreetMap         | Map data source                                |
| GraphHopper           | Routing, ETA, rerouting                        |
| Hyderabad OSM Extract | Reduced routing dataset for better performance |
| Osmium                | OSM dataset extraction and processing          |

---

## Realtime

| Technology | Purpose                         |
| ---------- | ------------------------------- |
| Socket.IO  | Realtime communication          |
| Redis      | Current bus locations and cache |

---

## Background Processing

| Technology | Purpose                    |
| ---------- | -------------------------- |
| BullMQ     | Background jobs and queues |
| Redis      | Queue backend              |
| Node Cron  | Scheduled jobs             |

---

## File Storage

| Technology                | Purpose                   |
| ------------------------- | ------------------------- |
| AWS S3 Compatible Storage | Images and uploaded files |

---

## Frontend Web

| Technology      | Purpose              |
| --------------- | -------------------- |
| Next.js         | Web application      |
| TypeScript      | Programming language |
| Tailwind CSS    | Styling              |
| shadcn/ui       | UI components        |
| Zustand         | State management     |
| React Hook Form | Forms                |
| Zod             | Form validation      |
| Lucide Icons    | Icons                |
| MapLibre GL JS  | Maps                 |

---

## Mobile Application

| Technology            | Purpose              |
| --------------------- | -------------------- |
| React Native          | Mobile application   |
| TypeScript            | Programming language |
| Zustand               | State management     |
| MMKV                  | Local storage        |
| Axios                 | API communication    |
| Socket.IO Client      | Realtime updates     |
| MapLibre React Native | Maps                 |

---

## Monitoring

| Technology | Purpose             |
| ---------- | ------------------- |
| Grafana    | Dashboards          |
| Prometheus | Metrics collection  |
| Loki       | Log aggregation     |
| Pino       | Application logging |

---

## Notifications

| Technology   | Purpose                   |
| ------------ | ------------------------- |
| Telegram Bot | Operational notifications |
| SMTP         | Email notifications       |
| Novu         | Notification management   |

---

## Infrastructure

| Technology     | Purpose          |
| -------------- | ---------------- |
| Docker         | Containerization |
| Nginx          | Reverse proxy    |
| GitHub Actions | CI/CD            |
| VPS            | Hosting          |

---

## Architecture Decisions

| Decision                    | Value                 |
| --------------------------- | --------------------- |
| Architecture Style          | Modular Monolith      |
| API Style                   | REST                  |
| Authentication              | JWT + Refresh Tokens  |
| Routing Engine              | GraphHopper           |
| Maps Provider               | OpenStreetMap         |
| Deployment                  | Single VPS            |
| Geographic Scope            | Hyderabad             |
| Realtime Protocol           | Socket.IO             |
| Current Location Storage    | Redis                 |
| Historical Location Storage | PostgreSQL            |
| Object Storage              | S3 Compatible Storage |

---

## Explicitly Not Using

* Kubernetes
* Kafka
* RabbitMQ
* ElasticSearch
* Microservices
* GraphQL
* Google Maps
* Firebase
* MinIO
* Traffic Prediction ML
* Event Sourcing

