'use strict';

const fs = require('fs');
const path = require('path');

/**
 * KST (UTC+09:00) 기준 ISO 8601 타임스탬프를 반환한다.
 * @param {Date} [date] 입력 날짜. 생략 시 현재 시각 사용.
 * @returns {string} 예: "2026-03-10T16:30:00.000+09:00"
 */
function getKSTISOString(date) {
  const d = date || new Date();
  const kst = new Date(d.getTime() + 9 * 60 * 60 * 1000);
  return kst.toISOString().replace('Z', '+09:00');
}

/**
 * KST (UTC+09:00) 기준 YYYY-MM-DD 날짜 문자열을 반환한다.
 * @param {Date} [date] 입력 날짜. 생략 시 현재 시각 사용.
 * @returns {string} 예: "2026-03-10"
 */
function getKSTDate(date) {
  const d = date || new Date();
  const kst = new Date(d.getTime() + 9 * 60 * 60 * 1000);
  return kst.toISOString().substring(0, 10);
}

const PDCA_KEYWORDS = {
  plan:   ['plan', 'planning', '계획', '기획', 'roadmap'],
  design: ['design', 'architecture', '설계', '아키텍처', 'spec'],
  do:     ['implement', 'develop', 'build', '구현', '개발', '빌드'],
  check:  ['verify', 'analyze', 'check', 'gap', '검증', '분석', '갭'],
  act:    ['improve', 'iterate', 'fix', '개선', '반복', '수정'],
  report: ['complete', 'report', 'summary', '완료', '보고서', '요약'],
};

/**
 * stdin에서 JSON 읽기 (동기). rawInput이 제공되면 그것을 사용 (테스트용).
 * @param {string} [rawInput] 선택적 입력 문자열 (테스트 시 사용)
 * @returns {object}
 */
function readStdin(rawInput) {
  try {
    const raw = (rawInput !== undefined) ? rawInput : fs.readFileSync(0, 'utf8');
    if (!raw || !raw.trim()) return {};
    return JSON.parse(raw.trim());
  } catch (e) {
    return {};
  }
}

/**
 * cwd에서 docs/.pdca-status.json이 있는 프로젝트 루트를 탐색.
 * @param {string} cwd
 * @returns {string}
 */
function getProjectRoot(cwd) {
  let dir = cwd || process.cwd();
  for (let i = 0; i < 10; i++) {
    if (fs.existsSync(path.join(dir, 'docs', '.pdca-status.json'))) return dir;
    const parent = path.dirname(dir);
    if (parent === dir) break;
    dir = parent;
  }
  return cwd || process.cwd();
}

/**
 * docs/.pdca-status.json 읽기.
 * @param {string} [cwd] 프로젝트 루트 (없으면 process.cwd() 사용)
 * @returns {object|null}
 */
function readPdcaStatus(cwd) {
  try {
    const root = getProjectRoot(cwd || process.cwd());
    const filePath = path.join(root, 'docs', '.pdca-status.json');
    const raw = fs.readFileSync(filePath, 'utf8');
    if (!raw || !raw.trim()) return null;
    return JSON.parse(raw.trim());
  } catch (e) {
    return null;
  }
}

/**
 * YYYYMMDD-HHmmss 형식 타임스탬프 생성.
 * @returns {string}
 */
function _formatTimestamp() {
  const d = new Date(new Date().getTime() + 9 * 60 * 60 * 1000);
  const pad = (n) => String(n).padStart(2, '0');
  return `${d.getUTCFullYear()}${pad(d.getUTCMonth() + 1)}${pad(d.getUTCDate())}-${pad(d.getUTCHours())}${pad(d.getUTCMinutes())}${pad(d.getUTCSeconds())}`;
}

/**
 * .pdca-snapshots/ 에 스냅샷 저장.
 * @param {object} status PDCA 상태 객체
 * @param {object} context Hook 컨텍스트 (cwd, session_id, trigger 포함)
 * @returns {string|null} 저장된 파일 경로 또는 실패 시 null
 */
function saveSnapshot(status, context) {
  try {
    const cwd = (context && context.cwd) ? context.cwd : process.cwd();
    const root = getProjectRoot(cwd);
    const snapshotDir = path.join(root, 'docs', '.pdca-snapshots');

    if (!fs.existsSync(snapshotDir)) {
      fs.mkdirSync(snapshotDir, { recursive: true });
    }

    const primary = status.primaryFeature || '';
    const featureData = (status.features && primary) ? status.features[primary] : null;

    const snapshot = {
      timestamp: getKSTISOString(),
      trigger: (context && context.trigger) || 'auto',
      sessionId: (context && context.session_id) || 'unknown',
      status,
      activeContext: {
        primaryFeature: primary,
        phase: featureData ? (featureData.phase || '') : '',
        phaseNumber: featureData ? (featureData.phaseNumber || 0) : 0,
        matchRate: featureData ? (featureData.matchRate || 0) : 0,
        documentPaths: featureData ? (featureData.documents || {}) : {},
      },
      resumeInstruction: buildResumeInstruction(status, context),
    };

    const fileName = `snap-${_formatTimestamp()}.json`;
    const filePath = path.join(snapshotDir, fileName);
    fs.writeFileSync(filePath, JSON.stringify(snapshot, null, 2), 'utf8');

    cleanOldSnapshots(snapshotDir, 10);
    return filePath;
  } catch (e) {
    debugLog('saveSnapshot', 'Error saving snapshot', { error: e.message });
    return null;
  }
}

/**
 * 오래된 스냅샷 정리 (max 개수 초과 시 가장 오래된 것 삭제).
 * @param {string} dir 스냅샷 디렉토리
 * @param {number} max 최대 유지 개수
 * @returns {number} 삭제된 파일 수
 */
function cleanOldSnapshots(dir, max) {
  try {
    const files = fs.readdirSync(dir)
      .filter(f => f.startsWith('snap-') && f.endsWith('.json'))
      .map(f => {
        const p = path.join(dir, f);
        return { name: f, path: p, mtime: fs.statSync(p).mtime.getTime() };
      })
      .sort((a, b) => a.mtime - b.mtime);

    const excess = files.length - max;
    if (excess <= 0) return 0;

    for (let i = 0; i < excess; i++) {
      fs.unlinkSync(files[i].path);
    }
    return excess;
  } catch (e) {
    debugLog('cleanOldSnapshots', 'Error', { error: e.message });
    return 0;
  }
}

/**
 * 단일 feature의 상태를 텍스트로 포맷.
 * @param {string} feature feature 이름
 * @param {object|null} data feature 상태 객체
 * @returns {string}
 */
function buildFeatureContext(feature, data) {
  if (!data) return `Feature: ${feature} (no data)`;
  const phase = data.phase || 'unknown';
  const phaseNum = data.phaseNumber || 0;
  const matchRate = (data.matchRate && data.matchRate > 0) ? `${data.matchRate}%` : '-';
  const docs = data.documents || {};
  const docList = Object.entries(docs).map(([k, v]) => `${k}(${v})`).join(', ');
  return `Feature: ${feature}\n- Phase: ${phase} (${phaseNum}/6)\n- Match Rate: ${matchRate}\n- Documents: ${docList || 'none'}`;
}

/**
 * 전체 PDCA 상태를 텍스트로 포맷 (2000자 이내).
 * @param {object|null} status
 * @returns {string}
 */
function buildFullContext(status) {
  if (!status) return '[PDCA] No active session.';
  const primary = status.primaryFeature;
  if (!primary || !status.features || !status.features[primary]) {
    return '[PDCA] No active feature.';
  }
  const d = status.features[primary];
  const mr = (d.matchRate && d.matchRate > 0) ? `, MR:${d.matchRate}%` : '';
  const result = `[PDCA] ${primary}: ${d.phase} (${d.phaseNumber}/6)${mr}`;
  return result.length > 200 ? result.substring(0, 197) + '...' : result;
}

/**
 * 텍스트에서 PDCA 관련 키워드를 감지.
 * @param {string} text 사용자 입력
 * @returns {{phase: string, keywords: string[]}|null}
 */
function detectPdcaKeywords(text) {
  if (!text || text.length < 3) return null;
  const lower = text.toLowerCase();
  if (lower.startsWith('/pdca')) return { phase: 'command', keywords: ['/pdca'] };
  for (const [phase, keywords] of Object.entries(PDCA_KEYWORDS)) {
    const matched = keywords.filter(kw => {
      if (/[가-힣]/.test(kw)) return lower.includes(kw);
      const regex = new RegExp(`\\b${kw}\\b`, 'i');
      return regex.test(text) && lower.includes('pdca');
    });
    if (matched.length > 0) return { phase, keywords: matched };
  }
  return null;
}

/**
 * stderr 디버그 로그.
 * @param {string} tag
 * @param {string} msg
 * @param {*} [data]
 */
function debugLog(tag, msg, data) {
  process.stderr.write(`[DEBUG:${tag}] ${msg}${data ? ' ' + JSON.stringify(data) : ''}\n`);
}

/**
 * 현재 phase에 해당하는 ref 파일 내용을 읽어 반환.
 * @param {string} root 프로젝트 루트 경로
 * @param {string} phase PDCA phase 문자열
 * @returns {string|null} ref 파일 내용 (3000자 초과 시 잘림) 또는 null
 */
function getPhaseRefContent(root, phase) {
  const PHASE_REF_MAP = {
    'plan':      '.claude/skills/pdca/refs/actions/plan.ref.md',
    'design':    '.claude/skills/pdca/refs/actions/design.ref.md',
    'do':        '.claude/skills/pdca/refs/actions/do.ref.md',
    'check':     '.claude/skills/pdca/refs/actions/analyze.ref.md',
    'act':       '.claude/skills/pdca/refs/actions/iterate.ref.md',
    'completed': '.claude/skills/pdca/refs/actions/report.ref.md',
  };
  const relPath = PHASE_REF_MAP[phase];
  if (!relPath) return null;
  try {
    const fullPath = path.join(root, relPath);
    const content = fs.readFileSync(fullPath, 'utf8');
    const MAX = 3000;
    if (content.length > MAX) {
      return content.substring(0, MAX) + '\n...(이하 생략)';
    }
    return content;
  } catch (e) {
    return null;
  }
}

/**
 * Compact 이후 Claude가 작업을 재개할 수 있는 구조화된 Resume Instruction 텍스트를 반환한다.
 * 반환값은 항상 2000자 이내이며, 시작/끝 마커를 포함한다.
 * @param {object|null} status PDCA 상태 객체
 * @param {object} hookContext Hook 컨텍스트
 * @returns {string}
 */
function buildResumeInstruction(status, hookContext) {
  const FALLBACK = '=== PDCA Resume Instruction ===\n[PDCA] No active feature. Run /pdca plan [feature] to start.\n=== End Resume Instruction ===';
  const MAX = 2000;

  try {
    if (!status || !status.primaryFeature) return FALLBACK;
    const feature = status.primaryFeature;
    const data = status.features && status.features[feature];
    if (!data) return FALLBACK;

    const phase = data.phase || 'unknown';
    const phaseNumber = data.phaseNumber || 0;
    const matchRate = (data.matchRate && data.matchRate > 0) ? `${data.matchRate}%` : '-';
    const iterationCount = data.iterationCount || 0;

    // Last Action
    const history = status.history || [];
    const lastAction = history.length > 0 ? history[history.length - 1].action : '(none)';

    // Next Command
    const PHASE_COMMANDS = {
      plan: `design`,
      design: `do`,
      do: `analyze`,
      act: `analyze`,
      completed: `report`,
    };
    let nextCmd;
    if (phase === 'check') {
      nextCmd = (data.matchRate && data.matchRate >= 90) ? `report` : `iterate`;
    } else {
      nextCmd = PHASE_COMMANDS[phase] || `plan`;
    }
    const nextAction = `/pdca ${nextCmd} ${feature}`;

    // Documents
    const docs = data.documents || {};
    const docEntries = Object.entries(docs);
    const docsSection = docEntries.length > 0
      ? 'Documents:\n' + docEntries.map(([k, v]) => `  - ${k}: ${v}`).join('\n')
      : '';

    // Phase-specific context
    const PHASE_CONTEXT = {
      plan: '계획 문서 작성 완료. design 단계를 시작하세요.',
      design: 'plan 문서를 기반으로 design 문서를 작성하세요.',
      do: `design 문서에 따라 구현하세요.`,
      check: `구현 분석 중. Match Rate: ${matchRate}. Gap 항목이 있으면 iterate를 실행하세요.`,
      act: `Gap 개선 중. Iteration: ${iterationCount}/5.`,
      completed: '모든 구현 완료. report를 생성하세요.',
    };
    const phaseContext = PHASE_CONTEXT[phase] || `현재 phase: ${phase}. 상태 파일을 확인하세요.`;

    // Ref File
    const REF_MAP = {
      plan: '.claude/skills/pdca/refs/actions/plan.ref.md',
      design: '.claude/skills/pdca/refs/actions/design.ref.md',
      do: '.claude/skills/pdca/refs/actions/do.ref.md',
      check: '.claude/skills/pdca/refs/actions/analyze.ref.md',
      act: '.claude/skills/pdca/refs/actions/iterate.ref.md',
      completed: '.claude/skills/pdca/refs/actions/report.ref.md',
    };
    const refFile = REF_MAP[phase] || '.claude/skills/pdca/refs/actions/plan.ref.md';

    const lines = [
      '=== PDCA Resume Instruction ===',
      `Feature: ${feature}`,
      `Phase: ${phase} (${phaseNumber}/6)`,
      `Match Rate: ${matchRate}`,
      `Iteration: ${iterationCount}/5`,
      '',
      `Last Action: ${lastAction}`,
      `Next Action: ${nextAction}`,
    ];
    if (docsSection) {
      lines.push('');
      lines.push(docsSection);
    }
    lines.push('');
    lines.push('Phase Context:');
    lines.push(`  ${phaseContext}`);
    lines.push('');
    lines.push(`Ref File: ${refFile}`);
    lines.push('=== End Resume Instruction ===');

    const result = lines.join('\n');

    if (result.length > MAX) {
      const truncated = result.substring(0, MAX - 60);
      return truncated + '\n...(truncated)\n=== End Resume Instruction ===';
    }
    return result;
  } catch (e) {
    debugLog('buildResumeInstruction', 'Error', { error: e.message });
    return FALLBACK;
  }
}

module.exports = {
  getKSTISOString,
  getKSTDate,
  readStdin,
  readPdcaStatus,
  saveSnapshot,
  cleanOldSnapshots,
  buildFeatureContext,
  buildFullContext,
  detectPdcaKeywords,
  debugLog,
  getProjectRoot,
  getPhaseRefContent,
  buildResumeInstruction,
};
