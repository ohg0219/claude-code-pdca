# PDCA Iteration Report: {feature}

## Overview

| Item | Value |
|------|-------|
| Feature | {feature} |
| Date | {date} |
| Total Iterations | {total_iterations} |
| Final Status | {status} |

## Iteration Configuration

```
Evaluators: gap-detector, code-analyzer
Thresholds:
  gap_analysis: {gap_threshold}%
  code_quality: {quality_threshold}%
Limits:
  max_iterations: {max_iterations}
```

## Score Progression

| Iteration | Gap Analysis | Code Quality | Overall |
|-----------|--------------|--------------|---------|
| Initial | {init_gap}% | {init_quality}% | {init_overall}% |
| 1 | {gap}% | {quality}% | {overall}% |
| ... | ... | ... | ... |
| **Final** | **{final_gap}%** | **{final_quality}%** | **{final_overall}%** |

## Issues Fixed

### By Severity

| Severity | Initial | Fixed | Remaining |
|----------|---------|-------|-----------|
| Critical | {N} | {N} | {N} |
| Warning | {N} | {N} | {N} |
| Info | {N} | {N} | {N} |

### By Category

| Category | Initial | Fixed | Remaining |
|----------|---------|-------|-----------|
| Design-Impl Gap | {N} | {N} | {N} |
| Security | {N} | {N} | {N} |
| Code Quality | {N} | {N} | {N} |

## Iteration Details

### Iteration {N}

**Scores:** Gap {N}% | Quality {N}%

**Issues Addressed:**
- [{severity}] {description}
  - Location: `{file}:{line}`
  - Fix: {fix_description}

**Files Modified:**
- {action}: `{path}`

---

## Changes Summary

### Created Files
- `{path}` - Purpose: {purpose}

### Modified Files
- `{path}` - Changes: {changes}

## Remaining Issues

{List any issues that could not be auto-fixed}

## Quality Metrics

### Before/After Comparison

| Metric | Before | After | Change |
|--------|--------|-------|--------|
| Design-Impl Match | {N}% | {N}% | {change} |
| Security Score | {N} | {N} | {change} |
| Complexity Avg | {N} | {N} | {change} |

## Next Steps

If successful:
1. Review changes: `/pdca analyze {feature}`
2. Create completion report: `/pdca report {feature}`

If partial/failed:
1. Review remaining issues above
2. Make manual fixes
3. Re-run: `/pdca iterate {feature}`
