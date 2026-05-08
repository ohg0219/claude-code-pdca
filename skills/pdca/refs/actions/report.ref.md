# report (Completion Report)

1. Check `matchRate` in status (warn if < 90%, but allow proceeding)
2. **Call report-generator Agent** using Task tool:
   - Provide Plan, Design, Analysis document paths
   - Agent reads all documents and generates integrated report
3. Read [report.template.md](../../templates/report.template.md) structure for the report
4. Output: `docs/04-report/features/{feature}.report.md`
5. Update status: `phase` = `"completed"`, `phaseNumber` = `6`
6. Create Task: `[Report] {feature}`
7. Add to history: `"report_generated"`

**Output**: `docs/04-report/features/{feature}.report.md`

> Action completed -> save snapshot. Procedure: see `refs/snapshot.ref.md`.
