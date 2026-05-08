---
name: pdca
description: "Manage PDCA cycle: plan, design, do, analyze, iterate, report"
argument-hint: "[action] [feature]"
user-invocable: true
allowed-tools: Read, Write, Edit, Glob, Grep, Bash, Task, TaskCreate, TaskUpdate, TaskList, TaskGet
---

# PDCA Skill

> Unified Skill for managing the PDCA cycle. Supports Plan → Design → Do → Check → Act flow.

## Arguments

| Argument | Description | Example |
|----------|-------------|---------|
| `plan [feature]` | Create Plan document | `/pdca plan user-auth` |
| `design [feature]` | Create Design document | `/pdca design user-auth` |
| `do [feature]` | Do phase guide | `/pdca do user-auth` |
| `analyze [feature]` | Run Gap analysis (Check) | `/pdca analyze user-auth` |
| `iterate [feature]` | Auto improvement (Act) | `/pdca iterate user-auth` |
| `report [feature]` | Generate completion report | `/pdca report user-auth` |
| `archive [feature]` | Archive completed documents | `/pdca archive user-auth` |
| `commit [feature] [hint]` | Commit changes | `/pdca commit user-auth` |
| `cleanup [all\|feature]` | Cleanup archived features | `/pdca cleanup` |
| `status` | Show current PDCA status | `/pdca status` |
| `next` | Guide to next phase | `/pdca next` |

## Template References

When creating documents, read the appropriate template from this directory:

- Plan: [plan.template.md](templates/plan.template.md)
- Design: [design.template.md](templates/design.template.md)
- Do: [do.template.md](templates/do.template.md)
- Analysis: [analysis.template.md](templates/analysis.template.md)
- Iteration Report: [iteration-report.template.md](templates/iteration-report.template.md)
- Report: [report.template.md](templates/report.template.md)

## Status File

All PDCA state is stored in `docs/.pdca-status.json` (v2.0 schema).

Read it at the start of every action to determine current state.
Update it after every action completes.

## Action Routing

**CRITICAL**: 각 액션 실행 시 해당 액션의 ref 파일을 Read할 것.
Read하지 않고 기억에 의존하여 실행하면 절차가 누락될 수 있음.

**캐시 예외 조건**: 세션 시작 시 `=== PDCA Phase Ref (캐시됨) ===` 블록이 출력에 포함된 경우,
해당 액션의 ref 내용이 이미 컨텍스트에 있으므로 별도 Read 호출을 생략할 수 있다.
단, 캐시 내용이 3000자로 잘린 경우(`...(이하 생략)` 포함)에는 전체 내용 확인을 위해 Read를 실행할 것.

| Action | Ref File | Prerequisites | Output |
|--------|----------|---------------|--------|
| plan | `refs/actions/plan.ref.md` | (없음) | `docs/01-plan/features/{feature}.plan.md` |
| design | `refs/actions/design.ref.md` | plan 완료 | `docs/02-design/features/{feature}.design.md` |
| do | `refs/actions/do.ref.md` | design 완료 | 구현 오케스트레이션 |
| analyze | `refs/actions/analyze.ref.md` | 구현 코드 존재 | `docs/03-analysis/{feature}.analysis.md` |
| iterate | `refs/actions/iterate.ref.md` | matchRate < 90% | 코드 수정 + iteration report |
| report | `refs/actions/report.ref.md` | check 완료 | `docs/04-report/features/{feature}.report.md` |
| archive | `refs/actions/archive.ref.md` | completed | `docs/archive/YYYY-MM/{feature}/`, `_INDEX.md` |
| cleanup | `refs/actions/cleanup.ref.md` | archived 존재 또는 orphan 항목 존재 | status 정리, history 슬라이딩 |
| commit | `refs/actions/commit.ref.md` | 변경사항 존재 | git commit (archive 이후 권장) |

**참고**: status, next는 이 SKILL.md 내 정보만으로 실행 가능.

### status

1. Read `docs/.pdca-status.json`
2. Display visualization:

```
PDCA Status
───────────────────────────────
Feature: {primaryFeature}
Phase: {phase} ({phaseNumber}/6)
Match Rate: {matchRate}%
Iteration: {iterationCount}/5
───────────────────────────────
[Plan] {icon} > [Design] {icon} > [Do] {icon} > [Check] {icon} > [Act] {icon} > [Report] {icon}

Active Features:
  - feature-a: Phase (N)
  - feature-b: Phase (N)
```

**Phase Icons:**
- ✅ Completed phase (already done)
- 🔄 Current phase (in progress)
- ⬜ Future phase (not started)
- ⏭️ Skipped phase (Act only — skipped when matchRate >= 90%)

**Post-Completion Icons** (primaryFeature=null이고 history에 완료 이벤트가 있을 때 status 하단에 표시):
- Archive ✅/⬜: history에 "archived" 이벤트 존재 여부
- Cleanup ✅/⬜: history에 "cleanup" 이벤트 존재 여부 (archived 이후)
- Commit ✅/⬜: history에 "committed" 이벤트 존재 여부 (cleanup 이후)

표시 형식:
```
Post-Completion: [Archive] ✅ > [Cleanup] ⬜ > [Commit] ⬜
```

**Act Icon Rule:**
- Act shows ⏭️ when: `phase` is `completed` AND `iterationCount` == 0 (iterate was never run)
- Act shows ✅ when: `iterationCount` > 0 (iterate was actually executed)
- Act shows 🔄 when: currently in iterate phase
- Act shows ⬜ when: check phase not yet reached

Example:
```
[Plan] ✅ > [Design] ✅ > [Do] 🔄 > [Check] ⬜ > [Act] ⬜ > [Report] ⬜
```

### next

1. Read status to find `primaryFeature` and its current `phase`
2. Suggest next action:

| Current Phase | Next Action | Command |
|---------------|-------------|---------|
| (none) | Create plan | `/pdca plan [feature]` |
| plan | Write design | `/pdca design {feature}` |
| design | Start implementation | `/pdca do {feature}` |
| do | Run gap analysis | `/pdca analyze {feature}` |
| check (< 90%) | Auto-improve | `/pdca iterate {feature}` |
| check (>= 90%) | Write report | `/pdca report {feature}` |
| completed | Archive | `/pdca archive {feature}` |
| archived | Cleanup status | `/pdca cleanup {feature}` |
| (after cleanup) | Commit changes | `/pdca commit` |

3. Output next action as text: display current phase, recommended command, and ask user to type the command in their next message. Do NOT use AskUserQuestion.

## Response Footer (Required)

**Every response MUST end with the dashboard footer.** Read `refs/footer.ref.md` for template and rules. Populate from `docs/.pdca-status.json`.
