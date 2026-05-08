# iterate (Act Phase)

1. Read status: check current `matchRate`
2. If >= 90%, inform: "Already passing. Run `/pdca report {feature}`"
3. If < 90%, **call pdca-iterator Agent** using Task tool:
   - Provide Design document path, Analysis document path, code paths
   - Agent runs Evaluator-Optimizer loop:
     a. Prioritize gaps (Critical > Warning > Info)
     b. Fix code (Edit/Write)
     c. Re-evaluate via gap-detector
     d. Repeat until >= 90% or max 5 iterations
4. Each iteration:
   - Create/Update Task: `[Act-N] {feature}` (N = iteration number)
   - Update status: `iterationCount++`, update `matchRate`
5. Final result:
   - **SUCCESS** (>= 90%): Guide to `/pdca report {feature}`
   - **FAILURE**: Show remaining issues, suggest manual fixes
6. Add to history: `"iteration_completed"` with `iteration` count and `matchRate`

**Output**: Updated code + optional `docs/03-analysis/{feature}.iteration-report.md`

> Action completed -> save snapshot. Procedure: see `refs/snapshot.ref.md`.
