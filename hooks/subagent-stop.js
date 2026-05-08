'use strict';

const common = require('./lib/common.js');

const PDCA_AGENTS = new Set(['gap-detector', 'pdca-iterator', 'report-generator']);

function extractMetrics(message) {
  const metrics = {};
  if (!message) return metrics;

  const mrMatch = message.match(/Match Rate[:\s]+(\d+)%/i);
  if (mrMatch) metrics.matchRate = parseInt(mrMatch[1], 10);

  const gapMatch = message.match(/(\d+)\s*(gaps?|갭)/i);
  if (gapMatch) metrics.gaps = parseInt(gapMatch[1], 10);

  return metrics;
}

function main() {
  try {
    const hookContext = common.readStdin();
    const agentType = hookContext.agent_type || 'unknown';

    if (!PDCA_AGENTS.has(agentType)) {
      common.debugLog('subagent-stop', `Non-PDCA agent completed: ${agentType}`);
      process.exit(0);
    }

    const metrics = extractMetrics(hookContext.last_assistant_message || '');
    const parts = [`[PDCA SubagentResult] ${agentType} completed.`];

    if (Object.keys(metrics).length > 0) {
      const metricStr = Object.entries(metrics)
        .map(([k, v]) => `${k}=${v}${k === 'matchRate' ? '%' : ''}`)
        .join(', ');
      parts.push(`Detected: ${metricStr}`);
    }

    process.stdout.write(parts.join(' ') + '\n');
    process.exit(0);
  } catch (e) {
    common.debugLog('subagent-stop', 'Error', { error: e.message });
    process.exit(0);
  }
}

main();
