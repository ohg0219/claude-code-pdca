# archive (Archive Phase)

1. **Prerequisite**: `phase` = `"completed"` or `matchRate` >= 90%
2. Create archive directory:
   ```bash
   mkdir -p "docs/archive/YYYY-MM/{feature}"
   ```

3. Move documents (파일 내용을 Read 도구로 읽지 말 것):

   **A. 존재하는 원본 파일 확인 + 복사** (없는 파일은 건너뜀):
   ```bash
   DEST="docs/archive/YYYY-MM/{feature}"
   CANDIDATES=(
     "docs/01-plan/features/{feature}.plan.md"
     "docs/02-design/features/{feature}.design.md"
     "docs/03-analysis/{feature}.analysis.md"
     "docs/04-report/features/{feature}.report.md"
   )
   SRC=(); for f in "${CANDIDATES[@]}"; do [ -f "$f" ] && SRC+=("$f"); done
   echo "원본 파일 ${#SRC[@]}개: ${SRC[*]##*/}"
   cp "${SRC[@]}" "$DEST/" && echo "cp exit:0" || echo "cp exit:$?"
   ```
   - `SRC` 배열에 실제 존재하는 파일만 담김 (없는 파일은 자동 제외)
   - cp 실패(exit != 0) 시: 원본이 그대로이므로 STOP 후 사용자에게 알릴 것

   **B. 복사 검증 — 원본 파일명 vs 대상 파일명 비교** (rm 실행 전 반드시 확인):
   ```bash
   SRC_NAMES=$(printf '%s\n' "${SRC[@]##*/}" | sort)
   DST_NAMES=$(ls -1 "$DEST/" | sort)
   echo "=== 원본 ==="; echo "$SRC_NAMES"
   echo "=== 복사됨 ==="; echo "$DST_NAMES"
   [ "$SRC_NAMES" = "$DST_NAMES" ] && echo "검증 성공" || echo "검증 실패"
   ```
   - 파일명 목록이 완전히 일치하면 성공. 하나라도 다르면 rm 실행하지 말고 STOP.

   **C. 원본 삭제** (검증 성공 후에만):
   ```bash
   rm "${SRC[@]}"
   ```

   **안전 규칙**:
   - Read/Write 도구로 파일 내용을 로드하거나 복사하지 말 것 (금지)
   - cp 성공 + 파일명 비교 검증 완료 후에만 rm 실행할 것 (순서 엄수)
   - cp 실패 시 원본이 그대로 보존되므로 안전하게 재시도 가능

4. Update or create `docs/archive/YYYY-MM/_INDEX.md`:
   ```bash
   INDEX="docs/archive/YYYY-MM/_INDEX.md"
   [ ! -f "$INDEX" ] && printf '# Archive Index — YYYY-MM\n\n| Feature | Match Rate | Iterations | Archived At | Report |\n|---------|-----------|------------|-------------|--------|\n' > "$INDEX"
   printf '| {feature} | {matchRate}%% | {iterationCount}회 | {YYYY-MM-DD} | [report]({feature}/{feature}.report.md) |\n' >> "$INDEX"
   ```
   - Read 도구로 _INDEX.md를 읽지 말 것 (append 방식으로 처리)
   - `%%`는 printf에서 리터럴 `%` 출력용 이스케이프

5. Update status:
   - Default: Delete feature from `features` object AND remove from `activeFeatures`
   - `--summary` flag: Convert to lightweight summary in `features`:
     ```json
     { "phase": "archived", "matchRate": N, "iterationCount": N,
       "startedAt": "...", "archivedAt": "...", "archivedTo": "docs/archive/..." }
     ```
   - If archived feature was `primaryFeature`: set `primaryFeature` to `null` or `activeFeatures[0]` (if others remain)

6. Add to history: `"archived"` with `archivedTo`

7. **완료 안내** (커밋 제안 없이 다음 단계 안내):
   - 출력: "Archive 완료. 다음 단계: `/pdca cleanup` → `/pdca commit`"

**Output**: `docs/archive/YYYY-MM/{feature}/`

> Action completed -> save snapshot. Procedure: see `refs/snapshot.ref.md`.
