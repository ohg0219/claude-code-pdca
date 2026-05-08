# do (Do Phase)

1. **Prerequisite**: Verify Design document exists
2. Read Design document:
   - Extract implementation order (Section 10.2)
   - Identify implementation scope: **frontend-only / backend-only / full-stack**
   - Check for Section 9 "TDD Test Scenarios"

   2.1. **Wave 분석** (Section 10.2 존재 시):
   - Section 10.2 (Implementation Order) 읽기
   - 태스크 간 의존성 파악: 체크박스 항목과 "의존", "depends on", "(N 완료 후)" 표기 기준
   - Wave 구성 규칙:
     - Wave 1: 다른 태스크에 의존하지 않는 독립 태스크 (최대 3개)
     - Wave N: Wave N-1 완료 후 가능한 태스크 (최대 3개)
   - Wave 구성 결과 예시:
     ```
     Wave 1: [Task-A, Task-B] (병렬 실행)
     Wave 2: [Task-C]         (Wave 1 완료 후)
     ```
   - Section 10.2가 없거나 의존성 파악 불가 시: Wave 분석 결과 = null → Step 3 Scope 모드로 fallback

   2.2. **[Pre-Wave: TDD Red]** Section 9 존재 시:
   - Section 8(AC) + Section 9(TDD Test Scenarios) 기반 실패 테스트 파일 먼저 작성
   - 위치: 프로젝트 테스트 디렉토리 (`tests/`, `__tests__/`, `spec/` 등 프로젝트 관례 따름)
   - 테스트 프레임워크: Section 9.1에 명시된 프레임워크 사용
   - 이 단계에서 구현 코드 없으므로 모두 실패(Red) 상태가 정상
   - Section 9가 없으면 이 단계 생략

3. **Route to agent(s)** based on Wave 분석(2.1) 또는 Design scope:

   **[Wave 모드]** (2.1 Wave 분석 결과가 유효할 때):
   - 각 Wave를 순차적으로 실행
   - Wave 내 태스크들은 단일 메시지에서 **병렬** Task() 에이전트 호출
   - 각 Wave 완료 확인 후 다음 Wave 진행
   - Wave 내 각 태스크의 에이전트 선택: 태스크 성격에 따라 아래 Scope 모드 기준 동일 적용

   **[Scope 모드]** (Wave 분석 결과 없거나 Section 10.2 부재 시 fallback):

   | Scope | Agent(s) | Call method |
   |-------|----------|-------------|
   | Frontend-only (UI, components, hooks, pages, styles) | Task(frontend-developer) | single |
   | Backend-only (API routes, services, DB, server logic) | Task(backend-developer) | single |
   | Full-stack (both) | Task(frontend-developer) + Task(backend-developer) | **parallel** |

   - **Full-stack parallel**: Launch both in a single response — provide each agent only its relevant Design sections

4. Agent call context to provide:
   - Design document path
   - Project context (framework, conventions)
   - TDD enabled flag (from step 2)
   - **If TDD**: Agent follows Red-Green-Refactor cycle based on TS-xx scenarios from Design Section 9
   - **If not TDD**: Agent implements based on Design Section 10 implementation order

   4.1. **[Post-Wave: TDD Green 확인]** Step 2.2가 실행된 경우:
   - Step 2.2에서 작성한 테스트 실행 시도 (Bash 도구)
   - 전체 통과(Green): 다음 단계 진행
   - 일부 실패: 실패 테스트 목록과 함께 구현 에이전트에 재작업 요청 (최대 1회)
   - 재작업 후에도 실패 또는 테스트 실행 환경 없음: 실패 목록을 기록하고 다음 단계 진행 (강제 중단 없음)

   4.2. **[검증 Wave: 독립 구현 검토]** 모든 구현 Wave 완료 후:
   - **clean context** 서브에이전트를 Task 도구로 호출 (구현 에이전트의 컨텍스트 미공유)
   - 제공 입력: design.md Section 8(AC 목록) + 구현된 파일 경로 목록만
   - 역할: "설계 의도 대비 구현 결과" 독립 검토 (AC별 충족/미충족 판정)
   - 출력: 미충족 AC 목록 (있을 경우) — 사용자에게 표시
   - **이 단계는 경고 목적이며 강제 중단 없음**: 미충족 항목 있어도 analyze로 진행

5. Review implementation results
6. Update status: `phase` = `"do"`, `phaseNumber` = `3`, `tdd.enabled` flag (if TDD detected)
7. Create Task: `[Do] {feature}` with `addBlockedBy` referencing Design task
8. Add to history: `"do_started"`

**Output**: Implemented source code files

> Action completed -> save snapshot. Procedure: see `refs/snapshot.ref.md`.
