# Snapshot Management

Snapshots are local backups for restoring PDCA state across sessions.
Stored in `docs/.pdca-snapshots/`, registered in `.gitignore`.

## Save Rules

**After every action (plan/design/do/analyze/iterate/report/archive/commit)** save a snapshot.

Procedure:
1. Get current date in `YYYYMMDD` format (e.g., `20260226`)
2. Delete existing snapshots for that date in `docs/.pdca-snapshots/`
   - Target: all files matching `snap-20260226-*.json`
3. New filename: `snap-{YYYYMMDD}-{HHMMSS}.json`
4. Contents:
   ```json
   {
     "timestamp": "<ISO 8601>",
     "trigger": "auto",
     "sessionId": "<random UUID>",
     "status": { /* full docs/.pdca-status.json */ },
     "activeContext": {
       "feature": "<primaryFeature>",
       "phase": "<current phase>",
       "lastAction": "<action name>"
     }
   }
   ```

## Restore Rules

On session start (`/pdca status` or `/pdca next`):
1. If `docs/.pdca-status.json` exists, use it (no snapshot needed)
2. If missing, read latest file from `docs/.pdca-snapshots/` to restore

## Retention Policy

- **Keep only 1 per day**: On save, delete all same-date snapshots first
- Old date files do not accumulate (1 per day cap)
- `docs/.pdca-status.json` is source of truth, so snapshot loss is acceptable
