'use strict';

const common = require('./lib/common.js');

function main() {
  try {
    const hookContext = common.readStdin();
    const userInput = hookContext.user_input || '';

    if (userInput.length < 3) {
      process.exit(0);
    }

    const match = common.detectPdcaKeywords(userInput);
    if (!match) {
      process.exit(0);
    }

    const status = common.readPdcaStatus(hookContext.cwd);
    const primary = status ? (status.primaryFeature || '') : '';
    const d = (status && status.features && primary) ? status.features[primary] : null;

    const lines = [];
    lines.push(`[PDCA Hint] 키워드 "${match.keywords.join(', ')}" 감지 → ${match.phase} phase.`);

    if (d) {
      lines.push(`현재 ${primary}는 ${d.phase} (${d.phaseNumber}/6).`);
      if (d.documents) {
        for (const [k, v] of Object.entries(d.documents)) {
          const cap = k.charAt(0).toUpperCase() + k.slice(1);
          lines.push(`${cap} 문서: ${v}`);
        }
      }
    } else {
      lines.push('/pdca plan [feature]로 시작하세요.');
    }

    process.stdout.write(lines.join(' ') + '\n');
    process.exit(0);
  } catch (e) {
    common.debugLog('user-prompt', 'Error', { error: e.message });
    process.exit(0);
  }
}

main();
