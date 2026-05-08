---
template: report
version: 1.1
description: PDCA completion report document template
variables:
  - feature: Feature name
  - date: Creation date (YYYY-MM-DD)
  - author: Author
  - project: Project name
  - version: Project version
---

# {feature} Completion Report

> **Status**: Complete / Partial / Cancelled
>
> **Project**: {project}
> **Version**: {version}
> **Author**: {author}
> **Completion Date**: {date}
> **PDCA Cycle**: #{cycle_number}

---

## 1. Summary

### 1.1 Project Overview

| Item | Content |
|------|---------|
| Feature | {feature} |
| Start Date | {start_date} |
| End Date | {date} |
| Duration | {duration} |

### 1.2 Results Summary

```
Completion Rate: {N}%
---
  Complete:     {N} / {N} items
  In Progress:  {N} / {N} items
  Cancelled:    {N} / {N} items
```

---

## 2. Related Documents

| Phase | Document | Status |
|-------|----------|--------|
| Plan | [{feature}.plan.md](../01-plan/features/{feature}.plan.md) | Finalized |
| Design | [{feature}.design.md](../02-design/features/{feature}.design.md) | Finalized |
| Check | [{feature}.analysis.md](../03-analysis/{feature}.analysis.md) | Complete |
| Act | Current document | Writing |

---

## 3. Completed Items

### 3.1 Functional Requirements

| ID | Requirement | Status | Notes |
|----|-------------|--------|-------|
| FR-01 | {Requirement 1} | Complete | |
| FR-02 | {Requirement 2} | Complete | |

### 3.2 Non-Functional Requirements

| Item | Target | Achieved | Status |
|------|--------|----------|--------|
| Performance | < 200ms | {N}ms | {status} |
| Test Coverage | 80% | {N}% | {status} |

---

## 4. Incomplete Items

| Item | Reason | Priority | Estimated Effort |
|------|--------|----------|------------------|
| {item} | {reason} | High/Medium/Low | {effort} |

---

## 5. Quality Metrics

### 5.1 Final Analysis Results

| Metric | Target | Final | Change |
|--------|--------|-------|--------|
| Design Match Rate | 90% | {N}% | {change} |
| Code Quality Score | 70 | {N} | {change} |
| Test Coverage | 80% | {N}% | {change} |
| Security Issues | 0 Critical | {N} | {status} |

### 5.2 Resolved Issues

| Issue | Resolution | Result |
|-------|------------|--------|
| {issue} | {resolution} | Resolved |

---

## 6. Lessons Learned

### 6.1 What Went Well (Keep)

- {Positive 1}
- {Positive 2}

### 6.2 What Needs Improvement (Problem)

- {Improvement 1}
- {Improvement 2}

### 6.3 What to Try Next (Try)

- {Try 1}
- {Try 2}

---

## 7. Next Steps

### 7.1 Immediate

- [ ] Production deployment
- [ ] Monitoring setup

### 7.2 Next PDCA Cycle

| Item | Priority | Expected Start |
|------|----------|----------------|
| {Next feature} | High | {date} |

---

## Version History

| Version | Date | Changes | Author |
|---------|------|---------|--------|
| 1.0 | {date} | Completion report created | {author} |
