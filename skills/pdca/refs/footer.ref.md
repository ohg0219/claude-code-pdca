# Response Footer Reference

> PDCA 스킬 응답의 필수 Footer 템플릿, 규칙, 예시를 정의한 참조 문서.
> SKILL.md의 Response Footer 섹션에서 참조됨.

---

## Template

Read `docs/.pdca-status.json` to populate the values dynamically.

```
─────────────────────────────────────────────────
📊 PDCA Dashboard
─────────────────────────────────────────────────
📌 Feature: {primaryFeature}
📍 Phase: {phase} ({phaseNumber}/6)
📈 Match Rate: {matchRate}%
🔄 Iteration: {iterationCount}/5
─────────────────────────────────────────────────
[Plan] {icon} > [Design] {icon} > [Do] {icon} > [Check] {icon} > [Act] {icon} > [Report] {icon}
─────────────────────────────────────────────────
✅ Action: {what was done in this response}
💡 Next: {recommended next command}
─────────────────────────────────────────────────
```

## Field Rules

- `{primaryFeature}`: From status JSON. Show "없음 - /pdca plan [feature]로 시작" if empty
- `{phase}`: Current phase name (Plan/Design/Do/Check/Act/Report/Completed)
- `{matchRate}`: From status JSON. Show "-" if not yet analyzed
- Phase icons: ✅ completed, 🔄 current, ⬜ future, ⏭️ skipped (Act only)
- **Act icon special rule**: Show ⏭️ when `phase` is `completed` or `report` was reached AND `iterationCount` == 0. Show ✅ when `iterationCount` > 0.
- `Action`: Brief summary of what this PDCA response did (e.g., "Plan 문서 생성 완료")
- `Next`: Suggest the next `/pdca` command based on current phase

## Example outputs

After `/pdca plan user-auth`:
```
─────────────────────────────────────────────────
📊 PDCA Dashboard
─────────────────────────────────────────────────
📌 Feature: user-auth
📍 Phase: Plan (1/6)
📈 Match Rate: -
🔄 Iteration: 0/5
─────────────────────────────────────────────────
[Plan] 🔄 > [Design] ⬜ > [Do] ⬜ > [Check] ⬜ > [Act] ⬜ > [Report] ⬜
─────────────────────────────────────────────────
✅ Action: Plan 문서 생성 완료
💡 Next: /pdca design user-auth
─────────────────────────────────────────────────
```

After `/pdca analyze user-auth` (matchRate 85%):
```
─────────────────────────────────────────────────
📊 PDCA Dashboard
─────────────────────────────────────────────────
📌 Feature: user-auth
📍 Phase: Check (4/6)
📈 Match Rate: 85%
🔄 Iteration: 0/5
─────────────────────────────────────────────────
[Plan] ✅ > [Design] ✅ > [Do] ✅ > [Check] 🔄 > [Act] ⬜ > [Report] ⬜
─────────────────────────────────────────────────
✅ Action: Gap 분석 완료 (85%)
💡 Next: /pdca iterate user-auth (90% 미달, 개선 권장)
─────────────────────────────────────────────────
```

After `/pdca report user-auth` (matchRate 92%, Act skipped):
```
─────────────────────────────────────────────────
📊 PDCA Dashboard
─────────────────────────────────────────────────
📌 Feature: user-auth
📍 Phase: Completed (6/6)
📈 Match Rate: 92%
🔄 Iteration: 0/5
─────────────────────────────────────────────────
[Plan] ✅ > [Design] ✅ > [Do] ✅ > [Check] ✅ > [Act] ⏭️ > [Report] ✅
─────────────────────────────────────────────────
✅ Action: 완료 보고서 생성 완료
💡 Next: /pdca archive user-auth
─────────────────────────────────────────────────
```
