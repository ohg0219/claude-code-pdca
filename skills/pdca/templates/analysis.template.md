---
template: analysis
version: 1.2
description: PDCA Check phase gap analysis document template
variables:
  - feature: Feature name
  - date: Creation date (YYYY-MM-DD)
  - author: Author
  - project: Project name
  - version: Project version
---

# {feature} Analysis Report

> **Analysis Type**: Gap Analysis / Code Quality / Performance Analysis
>
> **Project**: {project}
> **Version**: {version}
> **Analyst**: {author}
> **Date**: {date}
> **Design Doc**: [{feature}.design.md](../02-design/features/{feature}.design.md)

---

## 1. Analysis Overview

### 1.1 Analysis Purpose

{Purpose of conducting this analysis}

### 1.2 Analysis Scope

- **Design Document**: `docs/02-design/features/{feature}.design.md`
- **Implementation Path**: `src/features/{feature}/`
- **Analysis Date**: {date}

---

## 2. Gap Analysis (Design vs Implementation)

### 2.1 API Endpoints

| Design | Implementation | Status | Notes |
|--------|---------------|--------|-------|
| POST /api/{resource} | POST /api/{resource} | Match | |
| GET /api/{resource}/:id | GET /api/{resource}/:id | Match | |
| - | POST /api/{resource}/bulk | Missing in design | Added in impl |
| DELETE /api/{resource}/:id | - | Not implemented | Needs impl |

### 2.2 Data Model

| Field | Design Type | Impl Type | Status |
|-------|-------------|-----------|--------|
| id | string | string | Match |
| email | string | string | Match |
| metadata | - | object | Missing in design |

### 2.3 Component Structure

| Design Component | Implementation File | Status |
|------------------|---------------------|--------|
| {ComponentA} | src/components/{ComponentA}.tsx | Match |
| {ComponentB} | - | Not implemented |

### 2.4 Match Rate Summary

```
Overall Match Rate: {N}%
---
  Match:          {N} items ({N}%)
  Missing design: {N} items ({N}%)
  Not implemented: {N} items ({N}%)
```

### 2.5 Acceptance Criteria Verification

> design.md에 Section 8(Acceptance Criteria)이 없으면 이 섹션을 생략한다.

| ID | Criteria | Status | Evidence | Notes |
|----|----------|--------|----------|-------|
| AC-01 | {기준 설명} | Satisfied / Partial / Not Satisfied | {파일:라인 or 수동 확인} | {비고} |

**AC Summary**
```
Satisfied:     {N} items
Partial:       {N} items
Not Satisfied: {N} items
---
Iterate Required: Yes / No
```

---

## 3. Code Quality Analysis

### 3.1 Complexity Analysis

| File | Function | Complexity | Status | Recommendation |
|------|----------|------------|--------|----------------|
| {service}.ts | processData | 15 | High | Split function |
| utils.ts | formatDate | 3 | Good | - |

### 3.2 Security Issues

| Severity | File | Location | Issue | Recommendation |
|----------|------|----------|-------|----------------|
| Critical | auth.ts | L42 | Hardcoded secret | Move to env var |
| Warning | api.ts | L15 | Missing input validation | Add validation |

---

## 4. Convention Compliance

### 4.1 Naming Convention Check

| Category | Convention | Compliance | Violations |
|----------|-----------|:----------:|------------|
| Components | PascalCase | {N}% | {details} |
| Functions | camelCase | {N}% | {details} |
| Constants | UPPER_SNAKE_CASE | {N}% | {details} |
| Folders | kebab-case | {N}% | {details} |

---

## 5. Test Metrics (TDD) — if applicable

> 이 섹션은 Design 문서에 TDD Test Scenarios(Section 8)가 포함된 경우에만 작성합니다.

### 5.1 Coverage Summary

| Metric | Value | Target | Status |
|--------|-------|--------|--------|
| Line Coverage | {N}% | 80% | Pass/Fail |
| Branch Coverage | {N}% | 70% | Pass/Fail |
| Function Coverage | {N}% | 80% | Pass/Fail |

### 5.2 Test Results

| Total | Passing | Failing | Skipped |
|-------|---------|---------|---------|
| {N} | {N} | {N} | {N} |

### 5.3 Test Scenario Traceability

| Design TS-ID | Test File | Status | Notes |
|--------------|-----------|--------|-------|
| TS-01 | {path/to/test} | Pass/Fail | {notes} |
| TS-02 | {path/to/test} | Pass/Fail | {notes} |

---

## 5.5 Tech Debt Trend

> 이전 사이클 analysis.md가 없으면 아래 표를 **"최초 사이클 — N/A"** 로 채운다.

| Metric | Previous | Current | Delta | Verdict |
|--------|----------|---------|-------|---------|
| Max Complexity | {N or N/A} | {N} | {+N / -N / N/A} | OK / ⚠ Warning |
| Avg Line Coverage | {N% or N/A} | {N}% | {+N% / -N% / N/A} | OK / ⚠ Warning |
| Critical Issues | {N or N/A} | {N} | {+N / -N / N/A} | OK / ⚠ Warning |

**부채 경고 임계치**:
- 복잡도: 이전 대비 **+5 이상** 상승 → ⚠ Warning
- 커버리지: 이전 대비 **-10%p 이상** 하락 → ⚠ Warning
- Critical 이슈: **신규 발생** → ⚠ Warning

---

## 6. Overall Score

### 6.1 Base Score (Design Match)

```
Design Match Score: {N}/100
---
  Match:          {N} items ({N}%)
  AC Criteria:    {N} items ({N}%)
  Code Quality:   {N} points
  Security:       {N} points
  Convention:     {N} points
```

### 6.2 Extended Score (with TDD Metrics) — if applicable

```
Match Rate = (설계 일치율 × 0.7) + (테스트 메트릭 점수 × 0.3)

테스트 메트릭 점수:
  테스트 통과율:    {passing}/{total} = {N}%  (weight: 0.5)
  커버리지 달성률:  {actual}%/{target}% = {N}% (weight: 0.3)
  시나리오 구현률:  {impl}/{total} = {N}%     (weight: 0.2)
  ---
  테스트 메트릭 점수 = {N}

최종 Match Rate: {N}%
```

---

## 7. Recommended Actions

### 7.1 Immediate (Critical)

| Priority | Item | File | Assignee |
|----------|------|------|----------|
| 1 | {action} | {file}:{line} | - |

### 7.2 Short-term (Warning)

| Priority | Item | File | Expected Impact |
|----------|------|------|-----------------|
| 1 | {action} | {file} | {impact} |

---

## 8. Next Steps

- [ ] Fix Critical issues
- [ ] Update design document if needed
- [ ] Write completion report (`{feature}.report.md`) or iterate (`/pdca iterate`)

---

## Version History

| Version | Date | Changes | Author |
|---------|------|---------|--------|
| 0.1 | {date} | Initial analysis | {author} |
