'use strict';

const common = require('./lib/common.js');

function main() {
  try {
    const hookContext = common.readStdin();
    const status = common.readPdcaStatus(hookContext.cwd);

    if (!status) {
      const out = {
        hookSpecificOutput: {
          hookEventName: 'SubagentStart',
          additionalContext: '[PDCA] No active status.',
        },
      };
      process.stdout.write(JSON.stringify(out) + '\n');
      process.exit(0);
    }

    const primary = status.primaryFeature || '';
    const d = (status.features && primary) ? status.features[primary] : null;

    const parts = [];
    if (d) {
      parts.push(`[PDCA Context] Feature: ${primary}, Phase: ${d.phase} (${d.phaseNumber}/6)`);
      if (d.matchRate && d.matchRate > 0) parts.push(`Match Rate: ${d.matchRate}%`);
      // documents enumeration removed — agents read docs/.pdca-status.json directly when needed
    } else {
      parts.push('[PDCA Context] No active feature.');
    }

    const out = {
      hookSpecificOutput: {
        hookEventName: 'SubagentStart',
        additionalContext: parts.join('. '),
      },
    };
    process.stdout.write(JSON.stringify(out) + '\n');
    process.exit(0);
  } catch (e) {
    common.debugLog('subagent-start', 'Error', { error: e.message });
    process.exit(0);
  }
}

main();
