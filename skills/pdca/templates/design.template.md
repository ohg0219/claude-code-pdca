---
template: design
version: 1.3
description: PDCA Design phase document template
variables:
  - feature: Feature name
  - date: Creation date (YYYY-MM-DD)
  - author: Author
  - project: Project name
  - version: Project version
---

# {feature} Design Document

> **Summary**: {One-line description}
>
> **Project**: {project}
> **Version**: {version}
> **Author**: {author}
> **Date**: {date}
> **Status**: Draft
> **Complexity**: medium
> **Planning Doc**: [{feature}.plan.md](../01-plan/features/{feature}.plan.md)

---

## 1. Overview

### 1.1 Design Goals

{Technical goals this design aims to achieve}

### 1.2 Design Principles

- {Principle 1: e.g., Single Responsibility Principle}
- {Principle 2: e.g., Extensible architecture}

---

## 2. Architecture

### 2.1 Component Diagram

```
+---------------+     +---------------+     +---------------+
|   Client      |---->|   Server      |---->|  Database     |
|  (Browser)    |     |   (API)       |     | (Storage)     |
+---------------+     +---------------+     +---------------+
```

### 2.2 Data Flow

```
User Input -> Validation -> Business Logic -> Data Storage -> Response
```

### 2.3 Dependencies

| Component | Depends On | Purpose |
|-----------|-----------|---------|
| {Component A} | {Component B} | {Purpose} |

---

## 3. Data Model

### 3.1 Entity Definition

```typescript
interface {Entity} {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  // Additional fields...
}
```

### 3.2 Entity Relationships

```
[User] 1 ---- N [Post]
   |
   +-- 1 ---- N [Comment]
```

---

## 4. API Specification

### 4.1 Endpoint List

| Method | Path | Description | Auth |
|--------|------|-------------|------|
| GET | /api/{resource} | List all | Required |
| GET | /api/{resource}/:id | Get detail | Required |
| POST | /api/{resource} | Create | Required |
| PUT | /api/{resource}/:id | Update | Required |
| DELETE | /api/{resource}/:id | Delete | Required |

### 4.2 Detailed Specification

#### `POST /api/{resource}`

**Request:**
```json
{
  "field1": "string",
  "field2": "number"
}
```

**Response (201 Created):**
```json
{
  "id": "string",
  "field1": "string",
  "field2": "number",
  "createdAt": "2024-01-01T00:00:00Z"
}
```

**Error Responses:**
- `400 Bad Request`: Input validation failed
- `401 Unauthorized`: Authentication required
- `409 Conflict`: Duplicate data

---

## 5. UI/UX Design (if applicable)

### 5.1 Screen Layout

```
+------------------------------------+
|  Header                            |
+------------------------------------+
|                                    |
|  Main Content Area                 |
|                                    |
+------------------------------------+
|  Footer                            |
+------------------------------------+
```

### 5.2 Component List

| Component | Location | Responsibility |
|-----------|----------|----------------|
| {ComponentA} | src/components/ | {Role} |

---

## 6. Error Handling

| Code | Message | Cause | Handling |
|------|---------|-------|----------|
| 400 | Invalid input | Input error | Re-entry from client |
| 401 | Unauthorized | Auth failure | Redirect to login |
| 404 | Not found | Resource missing | Show 404 page |
| 500 | Internal error | Server error | Log and notify |

---

## 7. Security Considerations

- [ ] Input validation (XSS, SQL Injection prevention)
- [ ] Authentication/Authorization handling
- [ ] Sensitive data encryption
- [ ] HTTPS enforcement

---

## 8. Acceptance Criteria

> Plan 문서의 요구사항을 구현 관점에서 재정의한 수용 기준.
> gap-detector가 이 항목을 기준으로 구현 충족 여부를 검증한다.

### 8.1 Functional Acceptance Criteria

| ID    | Criteria | Verification Method | Priority |
|-------|----------|---------------------|----------|
| AC-01 | {Given [조건] / When [행동] / Then [결과] 형식 권장} | {자동 테스트 / 수동 검증 / 로그 확인} | Must/Should/Could |
| AC-02 | {기준 2} | {검증 방법} | Must/Should/Could |

### 8.2 Non-Functional Acceptance Criteria

| Category   | Criteria                        | Measurement Method     |
|------------|---------------------------------|------------------------|
| Performance | {예: API 응답시간 95th percentile < 200ms} | {k6 / JMeter / APM} |
| Security    | {예: 인증 없는 엔드포인트 접근 시 401 반환} | {통합 테스트}          |
| Reliability | {예: 에러 발생 시 사용자 데이터 유실 없음}  | {트랜잭션 롤백 테스트} |

### 8.3 Edge Cases

| ID    | Scenario                    | Expected Behavior              |
|-------|-----------------------------|--------------------------------|
| EC-01 | {경계값, 예외 입력, 동시성 등} | {시스템이 어떻게 반응해야 하는가} |

---

## 9. TDD Test Scenarios

### 9.1 Test Strategy

- **Approach**: TDD (Red-Green-Refactor)
- **Scope**: Unit tests for all business logic functions
- **Coverage Target**: 80%+
- **Test Framework**: {프로젝트에 맞는 프레임워크 (Jest/Vitest/pytest 등)}

### 9.2 Test Scenario List

| ID | Target | Description | Input | Expected Output | Priority |
|----|--------|-------------|-------|-----------------|----------|
| TS-01 | {함수/컴포넌트명} | {테스트 설명} | {입력 조건} | {기대 결과} | Critical/High/Medium/Low |
| TS-02 | {함수/컴포넌트명} | {테스트 설명} | {입력 조건} | {기대 결과} | Critical/High/Medium/Low |

### 9.3 Edge Cases

| ID | Scenario | Expected Behavior |
|----|----------|-------------------|
| EC-01 | {경계 조건 설명} | {기대 동작} |

### 9.4 Test Implementation Order

1. TS-01: {이유 - 핵심 로직이므로 먼저}
2. TS-02: {이유 - TS-01에 의존}

---

## 10. Implementation Guide

### 10.1 File Structure

```
src/
  features/{feature}/
    components/
    hooks/
    api/
    types/
```

### 10.2 Implementation Order

1. [ ] Define data model
2. [ ] Implement API
3. [ ] Implement UI components
4. [ ] Integration and testing

---

## Version History

| Version | Date | Changes | Author |
|---------|------|---------|--------|
| 0.1 | {date} | Initial draft | {author} |
