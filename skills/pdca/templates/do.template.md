---
template: do
version: 1.0
description: PDCA Do phase implementation guide template
variables:
  - feature: Feature name
  - date: Creation date (YYYY-MM-DD)
  - author: Author
  - project: Project name
  - version: Project version
---

# {feature} Implementation Guide

> **Summary**: {One-line description}
>
> **Project**: {project}
> **Version**: {version}
> **Author**: {author}
> **Date**: {date}
> **Status**: In Progress
> **Design Doc**: [{feature}.design.md](../02-design/features/{feature}.design.md)

---

## 1. Pre-Implementation Checklist

- [ ] Plan document reviewed: `docs/01-plan/features/{feature}.plan.md`
- [ ] Design document reviewed: `docs/02-design/features/{feature}.design.md`
- [ ] Dependencies installed
- [ ] Development server running
- [ ] Required environment variables set

---

## 2. Implementation Order

### 2.1 Phase 1: Data Layer

| Priority | Task | File/Location | Status |
|:--------:|------|---------------|:------:|
| 1 | Define types/interfaces | `src/types/{feature}.ts` | - |
| 2 | Create data models | `src/domain/{feature}/` | - |
| 3 | Set up API client | `src/lib/api/{feature}.ts` | - |

### 2.2 Phase 2: Business Logic

| Priority | Task | File/Location | Status |
|:--------:|------|---------------|:------:|
| 4 | Implement services | `src/services/{feature}.ts` | - |
| 5 | Create custom hooks | `src/hooks/use{Feature}.ts` | - |
| 6 | Add state management | `src/stores/{feature}.ts` | - |

### 2.3 Phase 3: UI Components

| Priority | Task | File/Location | Status |
|:--------:|------|---------------|:------:|
| 7 | Create base components | `src/components/{feature}/` | - |
| 8 | Implement pages/routes | `src/app/{feature}/` | - |
| 9 | Add error handling UI | `src/components/error/` | - |

### 2.4 Phase 4: Integration

| Priority | Task | File/Location | Status |
|:--------:|------|---------------|:------:|
| 10 | Connect API to UI | Component integration | - |
| 11 | Add loading states | All async components | - |
| 12 | Implement error handling | Try-catch, error boundaries | - |

---

## 3. Key Files to Create/Modify

### 3.1 New Files

| File Path | Purpose |
|-----------|---------|
| `src/types/{feature}.ts` | Type definitions |
| `src/services/{feature}.ts` | Business logic |
| `src/components/{feature}/index.tsx` | Main component |

### 3.2 Files to Modify

| File Path | Changes |
|-----------|---------|
| `src/app/layout.tsx` | Add provider/context |
| `src/lib/api/client.ts` | Add endpoints |

---

## 4. Dependencies

```bash
# Add any new dependencies here
npm install {package1} {package2}
```

---

## 5. Implementation Notes

### 5.1 Design Decisions Reference

| Decision | Choice | Rationale |
|----------|--------|-----------|
| State Management | {choice} | {reason} |
| API Pattern | {choice} | {reason} |

### 5.2 Things to Avoid

- [ ] Hardcoded values (use constants/config)
- [ ] Direct DOM manipulation (use framework patterns)
- [ ] Console.log in production code

---

## 6. TDD Implementation Process (if Design includes TDD Test Scenarios)

### Step 1: 테스트 환경 설정

- [ ] 테스트 프레임워크 설치 및 설정
- [ ] 테스트 디렉토리 구조 생성 (`__tests__/` 또는 `*.test.*`)
- [ ] 테스트 실행 스크립트 확인 (`npm test` / `pytest` 등)

### Step 2: Red-Green-Refactor 사이클 실행

Design 문서의 **Section 8.4 Test Implementation Order** 순서대로 진행:

#### Cycle N: {TS-ID} - {테스트 설명}

**RED Phase** (테스트 작성)
- [ ] 테스트 파일 생성/수정
- [ ] Design의 테스트 시나리오(입력/기대결과) 기반으로 테스트 코드 작성
- [ ] 테스트 실행 → **실패 확인 (Red)**
- [ ] 실패 이유가 "구현 미완료"인지 확인 (테스트 자체 오류가 아님)

**GREEN Phase** (최소 구현)
- [ ] 테스트를 통과하기 위한 **최소한의** 코드 작성
- [ ] 테스트 실행 → **통과 확인 (Green)**
- [ ] 기존 테스트도 여전히 통과하는지 확인 (회귀 방지)

**REFACTOR Phase** (리팩토링)
- [ ] 코드 중복 제거
- [ ] 명명 규칙 정리, 가독성 개선
- [ ] 테스트 실행 → **여전히 통과 확인**
- [ ] 테스트 코드도 리팩토링 (중복 제거, 헬퍼 추출 등)

### Step 3: 사이클 완료 체크

- [ ] 모든 테스트 시나리오(TS-xx) 구현 완료
- [ ] 전체 테스트 통과 (0 failures)
- [ ] 커버리지 목표 달성 여부 확인
- [ ] Edge Case(EC-xx) 테스트 포함 여부 확인

---

## 7. Testing Checklist (Non-TDD fallback)

> TDD Test Scenarios가 Design에 없는 경우 이 섹션을 사용합니다.

- [ ] Happy path works correctly
- [ ] Error states handled properly
- [ ] Loading states displayed
- [ ] Edge cases covered
- [ ] No TypeScript errors
- [ ] No lint warnings

---

## 8. Post-Implementation

When all items above are complete:

```bash
# Run Gap Analysis (includes test metrics if TDD was used)
/pdca analyze {feature}
```

---

## Version History

| Version | Date | Changes | Author |
|---------|------|---------|--------|
| 0.1 | {date} | Initial implementation start | {author} |
