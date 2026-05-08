# analyze (Check Phase)

1. **동적 임계값 결정**: design.md 헤더에서 `**Complexity**` 필드 읽기:
   - `high`   → `threshold = 95`
   - `medium` → `threshold = 90`
   - `low`    → `threshold = 85`
   - 필드 없음 또는 알 수 없는 값 → `threshold = 90` (하위 호환)
   - 이후 모든 matchRate 비교는 이 `threshold` 값 기준으로 적용

2. **Prerequisite**: Implementation code should exist (Do phase started)
3. Verify Design document exists
4. Find implementation code paths (search `src/`, `app/`, `lib/`, `components/`, etc.)
5. **Call gap-detector AND code-analyzer Agents in parallel** using Task tool (single message, two Task() calls):
   - **Task(gap-detector)**: Provide Design document path + implementation code paths → returns Base Match Rate + Gap list
   - **Task(code-analyzer)**: Provide implementation code paths → returns Code Quality Score + Issues table (Complexity, Security, Convention)
   - Merge results: gap-detector → analysis.md Sections 2, 4 / code-analyzer → analysis.md Sections 3, 4
6. **If `tdd.enabled` is true in status (TDD mode)**:
   a. Collect test results (run test command, parse output for pass/fail counts)
   b. Collect coverage data (parse coverage report for line/branch/function %)
   c. Build Test Scenario Traceability (map TS-xx to test files and status)
   d. Calculate extended Match Rate:
      ```
      Match Rate = (design match * 0.7) + (test metrics * 0.3)
      test metrics = (pass rate * 0.5) + (coverage * 0.3) + (scenario impl rate * 0.2)
      ```
   e. Update status: `tdd.testsPassing`, `tdd.testsFailing`, `tdd.coverage`
   f. If test data collection fails, fall back to base Match Rate only (warn user)
7. **Tech Debt Trend 계산** (analysis.md Section 5.5 채우기):
   a. **이전 분석 문서 탐색**:
      - `docs/03-analysis/{feature}.analysis.md` 존재 여부 확인
      - 없으면 `docs/archive/` 하위에서 `{feature}.analysis.md` 검색
   b. **탐색 성공 시** (이전 문서 있음):
      - 이전 문서에서 수치 추출:
        - Max Complexity (Section 3.1 Complexity Analysis 테이블)
        - Avg Line Coverage (Section 5.1 Coverage Summary)
        - Critical Issues 수 (Section 3.2 Security Issues 테이블)
      - Delta 계산: Current − Previous
      - 임계치 판단:
        - 복잡도: Delta >= +5 → ⚠ Warning
        - 커버리지: Delta <= -10%p → ⚠ Warning
        - Critical 이슈: 신규 발생(Delta > 0) → ⚠ Warning
   c. **탐색 실패 시** (이전 문서 없음):
      - Section 5.5 테이블 전체를 "최초 사이클 — N/A"로 기록
   d. **임계치 초과 항목이 1개 이상이면**:
      - Step 13 안내 메시지에 "⚠ Tech Debt Warning: iterate 강력 권고" 추가
8. **Calculate Combined Match Rate**:
   ```
   Combined Match Rate = (gap_match_rate × 0.7) + (code_quality_score × 0.3)
   ```
   - `gap_match_rate`: gap-detector 결과 (0–100%)
   - `code_quality_score`: code-analyzer Code Quality Score (0–100점 → 0–100%)
   - **Critical security issue가 1개 이상이면**: Combined Match Rate를 자동으로 89% 이하로 cap (iterate 강제)
   - TDD mode인 경우: TDD extended score를 gap_match_rate 대신 사용
9. Read [analysis.template.md](../../templates/analysis.template.md) and create `docs/03-analysis/{feature}.analysis.md`
   - Section 2: gap-detector 결과 (Gap list, Base Match Rate)
   - Section 3: code-analyzer 결과 (Complexity, Security Issues)
   - Section 4: code-analyzer Convention 결과
   - Section 6: Combined Match Rate 기록
   - Include Section 5 (Test Metrics) if TDD mode
10. Update status: `phase` = `"check"`, `phaseNumber` = `4`, `matchRate` = Combined Match Rate result
11. Create Task: `[Check] {feature}` with `addBlockedBy` referencing Do task
12. Add to history: `"check_completed"` with `matchRate`
13. Guide based on Match Rate vs `threshold` (from Step 1):
    - **>= threshold**: "Design-implementation aligned (threshold: {threshold}%). Run `/pdca report {feature}`"
    - **threshold-20 ~ threshold-1**: "Some gaps found. Run `/pdca iterate {feature}` recommended"
    - **< threshold-20**: "Significant gaps. Run `/pdca iterate {feature}` required"
    - analysis.md Section 1에 "적용 임계값: {threshold}% (Complexity: {value})" 반드시 기록

**Output**: `docs/03-analysis/{feature}.analysis.md`

> Action completed -> save snapshot. Procedure: see `refs/snapshot.ref.md`.
