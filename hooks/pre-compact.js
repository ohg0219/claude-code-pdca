'use strict';

const path = require('path');
const common = require('./lib/common.js');

function main() {
  try {
    const hookContext = common.readStdin();
    const status = common.readPdcaStatus(hookContext.cwd);

    if (!status) {
      process.stdout.write('[PDCA] No status file found. Skipping snapshot.\n');
      process.exit(0);
    }

    const snapshotPath = common.saveSnapshot(status, hookContext);
    const snapshotName = snapshotPath ? path.basename(snapshotPath) : 'unknown';
    const trigger = hookContext.trigger || 'auto';

    const lines = [];
    lines.push(`[PDCA Snapshot Saved] trigger=${trigger}, file=${snapshotName}`);
    lines.push('');
    lines.push('=== PDCA 상태 보존 ===');

    const primary = status.primaryFeature;
    if (primary && status.features && status.features[primary]) {
      const d = status.features[primary];
      lines.push(`Primary Feature: ${primary} (${d.phase}, ${d.phaseNumber}/6)`);
    }

    if (status.activeFeatures && status.activeFeatures.length > 0) {
      lines.push('All Features:');
      for (const f of status.activeFeatures) {
        const d = status.features && status.features[f];
        if (d) {
          const mr = (d.matchRate && d.matchRate > 0) ? `, matchRate=${d.matchRate}%` : ', matchRate=-';
          lines.push(`  - ${f}: ${d.phase} (${d.phaseNumber}/6)${mr}`);
        }
      }
    }

    if (status.history && status.history.length > 0) {
      lines.push('Recent History:');
      const recent = status.history.slice(-3).reverse();
      for (const h of recent) {
        const ts = h.timestamp ? h.timestamp.substring(0, 10) : '';
        const mr = h.matchRate ? `, ${h.matchRate}%` : '';
        lines.push(`  - ${h.action} (${h.feature || ''}${mr}) @ ${ts}`);
      }
    }

    if (primary && status.features && status.features[primary]) {
      const docs = status.features[primary].documents || {};
      if (Object.keys(docs).length > 0) {
        lines.push('Documents:');
        for (const [k, v] of Object.entries(docs)) {
          lines.push(`  - ${primary}.${k}: ${v}`);
        }
      }
    }

    lines.push('이 정보는 context compaction 전에 저장되었습니다. 이후 작업에서 이 컨텍스트를 참고하세요.');
    process.stdout.write(lines.join('\n') + '\n');
    // Resume Instruction 블록 append (기존 출력 유지 + 신규 추가)
    const resumeInstruction = common.buildResumeInstruction(status, hookContext);
    process.stdout.write('\n' + resumeInstruction + '\n');
    process.exit(0);
  } catch (e) {
    common.debugLog('pre-compact', 'Error', { error: e.message });
    process.exit(0);
  }
}

main();
