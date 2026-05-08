# commit (Utility)

Session changes to git commit. Does not change PDCA phase.

**Recommended timing**: After Do (implementation), after Report, or after Cleanup.
Recommended flow: `/pdca archive` → `/pdca cleanup` → `/pdca commit`

1. Read `docs/.pdca-status.json`:
   - If feature argument provided, use that feature
   - Otherwise use `primaryFeature`
   - If no `primaryFeature`, general commit mode (no PDCA tracking)
2. **Understand changes:**
   - Review conversation history to understand what was accomplished
   - `git status` to check current changes
   - `git diff` to understand modifications (staged + unstaged)
   - Consider whether to make one commit or multiple logical commits
3. **Write commit message (Gitmoji rules):**

   #### Format
   ```
   <gitmoji> <title> (under 50 chars)

   <body> (optional, 72-char line wrap)

   <footer> (optional)
   ```

   #### Gitmoji Mapping
   | Emoji | Code | Purpose |
   |-------|------|---------|
   | ✨ | `:sparkles:` | New feature |
   | 🐛 | `:bug:` | Bug fix |
   | ♻️ | `:recycle:` | Code refactoring (no behavior change) |
   | 🎨 | `:art:` | Code structure/format improvement |
   | ⚡ | `:zap:` | Performance improvement |
   | 🔧 | `:wrench:` | Config file add/modify |
   | 📝 | `:memo:` | Documentation add/modify |
   | ✅ | `:white_check_mark:` | Test add/modify |
   | 🔥 | `:fire:` | Code/file removal |
   | 🚚 | `:truck:` | File/path move or rename |
   | 💄 | `:lipstick:` | UI/style change |
   | 🏗️ | `:building_construction:` | Architecture change |
   | ➕ | `:heavy_plus_sign:` | Add dependency |
   | ➖ | `:heavy_minus_sign:` | Remove dependency |
   | 🔒 | `:lock:` | Security fix |
   | 🗃️ | `:card_file_box:` | DB change (migration, schema) |
   | 🚀 | `:rocket:` | Deploy |
   | 🩹 | `:adhesive_bandage:` | Simple/minor fix (non-critical) |
   | 📦 | `:package:` | Build system/packaging change |
   | 🔀 | `:twisted_rightwards_arrows:` | Branch merge |

   > For unlisted cases see https://gitmoji.dev. Use **one emoji per commit**.

   #### Title Rules (Key)

   **Principle: "Applying this commit will ___" must complete as a sentence.**

   - Use Korean imperative tone ("추가", "수정", "제거", "개선", "변경")
   - **Specify the change target (what)** -- include at least one of: filename, classname, feature name
   - **Show scope** -- make it clear where the change happened
   - Under 50 chars (excluding emoji)
   - No period at end

   **Bad -> Good examples:**

   ```
   Bad:  🐛 버그 수정
   Good: 🐛 OrderService에서 null 주문 시 NPE 발생하는 문제 수정

   Bad:  ✨ 기능 추가
   Good: ✨ 회원가입 시 이메일 중복 검증 API 추가

   Bad:  ♻️ 코드 리팩토링
   Good: ♻️ UserRepository 쿼리를 MyBatis XML에서 어노테이션 방식으로 전환
   ```

   #### Body Rules (when changes are complex)

   Write body when:
   - 3+ files changed
   - Behavior changes
   - Need to explain why this approach was chosen

   Body structure:
   ```
   ## 무엇을
   - 핵심 변경 사항 나열

   ## 왜
   - 변경 이유/배경

   ## 참고 (Optional)
   - 관련 이슈, 사이드 이펙트, 후속 작업
   ```

4. **Present plan to user:**
   - List files to add for each commit
   - Show commit message (title + body preview)
   - Ask: "[N] commits planned. Proceed?"
5. **After confirmation:**
   - `git add` specific files (never use `-A` or `.`)
   - Create commit with planned message (HEREDOC format)
   - Show result with `git log --oneline -n [number]`
6. **Update PDCA status** (only when active feature exists):
   - Update `updatedAt` timestamp
   - Add `"committed"` event to history:
     ```json
     { "action": "committed", "feature": "...", "timestamp": "...",
       "phase": "...", "commitCount": N, "commitMessages": ["..."] }
     ```

**Commit rules (mandatory):**
- **Never add co-author info or Claude attribution**
- Commits are authored only by the user
- No "Generated with Claude" messages
- No "Co-Authored-By" lines
- Group related changes together
- Keep commits focused and atomic when possible
- **One commit = one logical change = one emoji**
- If the title is vague, consider splitting into smaller commits first

> Action completed -> save snapshot. Procedure: see `refs/snapshot.ref.md`.
