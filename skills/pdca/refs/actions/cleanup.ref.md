# cleanup

1. Read `docs/.pdca-status.json`

2. **고아 항목 탐지** (argument 무관하게 항상 실행):
   - `activeFeatures` 중 `features` 키에 없는 항목 → orphanActive 목록
   - `features` 중 `phase === "archived"` 인 항목 → archivedFeatures 목록

3. Based on argument:
   - **No argument**: 정리 대상 목록 출력 후 사용 안내:
     ```
     정리 대상 (archivedFeatures + orphanActive):
       - {feature1}  (archived)
       - {feature2}  (orphan)
     총 N개. 실행: /pdca cleanup all  또는  /pdca cleanup {feature}
     ```
     Do NOT use AskUserQuestion.
   - **`all`**: archivedFeatures 전체를 `features`에서 삭제; orphanActive를 `activeFeatures`에서 제거
   - **`{feature}`**: 해당 feature를 `features`에서 삭제 (phase 무관); `activeFeatures`에서도 제거

4. **primaryFeature 재설정**:
   - cleanup 후 `primaryFeature`가 삭제된 feature를 가리키면:
     - 남은 `activeFeatures[0]`이 있으면 그 값으로 변경
     - 없으면 `null`로 변경

5. **history 슬라이딩 윈도우**:
   a. "cleanup" 이벤트를 history 끝에 추가:
      ```json
      { "action": "cleanup", "deletedFeatures": [...], "timestamp": "YYYY-MM-DDTHH:mm:ss.sssZ" }
      ```
   b. `history.length > 50` 이면: `history = history.slice(-50)` (오래된 항목부터 제거)

6. Archive documents in `docs/archive/` are NOT deleted (status 정리만)

> Action completed -> save snapshot. Procedure: see `refs/snapshot.ref.md`.
