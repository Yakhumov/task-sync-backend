-- Rename misnamed column "is_completed" (INTEGER) on "user" table to "work_interval"
ALTER TABLE "user" RENAME COLUMN "is_completed" TO "work_interval";
