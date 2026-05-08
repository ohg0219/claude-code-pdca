# plan (Plan Phase)

1. Check if `docs/01-plan/features/{feature}.plan.md` exists
2. If exists, display content and suggest modifications
3. If not, **call product-manager Agent** using Task tool:
   - Provide: feature name, project context (package.json or directory name), plan template path
   - Agent analyzes codebase context, defines requirements, and creates plan document
   - Agent reads [plan.template.md](../../templates/plan.template.md) and produces `docs/01-plan/features/{feature}.plan.md`
4. Review agent output and confirm document was created
5. Update `docs/.pdca-status.json`:
   - Set `features[feature].phase` = `"plan"`
   - Set `features[feature].phaseNumber` = `1`
   - Set `features[feature].documents.plan` = file path
   - Add feature to `activeFeatures`
   - Set `primaryFeature`
   - Set timestamps
6. Create Task: `[Plan] {feature}`
7. Add to history: `{ "action": "plan_created", "feature": "...", "timestamp": "..." }`

**Output**: `docs/01-plan/features/{feature}.plan.md`

> Action completed -> save snapshot. Procedure: see `refs/snapshot.ref.md`.
