# Backups

## What Is Backed Up

| Data | Backup Method | Frequency | Retention |
| -------------------- | ------------- | --------- | --------- |
| PostgreSQL | pg_dump → S3 | Daily 2am | 30 days |
| Redis | RDB snapshot | Every 1hr | 7 days |
| Application config | Git | On change | Forever |
| OSM/GraphHopper data | Manual S3 copy | On update | Latest 2 |

---

## PostgreSQL Backup

Runs as a Docker cron container (or Node Cron job):

```bash
# Daily at 2am
pg_dump $DATABASE_URL --format=custom --compress=9 \
  | gzip \
  | aws s3 cp - s3://$BACKUP_BUCKET/postgres/$(date +%Y-%m-%d).dump.gz
```

Restore:

```bash
aws s3 cp s3://$BACKUP_BUCKET/postgres/2026-06-19.dump.gz - \
  | gunzip \
  | pg_restore --dbname=$DATABASE_URL --clean
```

---

## Redis Backup

Redis RDB persistence configured in `redis.conf`:

```
save 3600 1    # Save if 1 key changed in 1 hour
save 300 100   # Save if 100 keys changed in 5 min
```

RDB file is mounted on a Docker volume — backed up to S3 hourly.

---

## Backup Verification

Weekly: restore latest PostgreSQL backup to a staging container and run schema validation:

```bash
pg_restore --dbname=postgres://test@localhost/govexa_test --clean backup.dump
prisma migrate status  # Verify schema matches
```

---

## Recovery Time Objectives

| Scenario | Target Recovery Time |
| --------------------------- | -------------------- |
| Database restore | < 30 minutes |
| Full VPS rebuild | < 2 hours |
| GraphHopper data rebuild | < 1 hour (rerun setup.sh) |
