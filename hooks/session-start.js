'use strict';

const common = require('./lib/common.js');

function main() {
  try {
    const hookContext = common.readStdin();
    const status = common.readPdcaStatus(hookContext.cwd);

    if (!status) {
      process.stdout.write('[PDCA] No active PDCA session. Run /pdca plan [feature] to start.\n');
      process.exit(0);
    }

    const context = common.buildFullContext(status);
    process.stdout.write(context + '\n');

    // Phase ref 캐싱: 현재 phase의 ref 파일 내용을 출력에 포함
    const primary = status.primaryFeature;
    if (primary && status.features && status.features[primary]) {
      const phase = status.features[primary].phase;
      const root = common.getProjectRoot(hookContext.cwd);
      const refContent = common.getPhaseRefContent(root, phase);
      if (refContent) {
        process.stdout.write('\n=== PDCA Phase Ref (캐시됨) ===\n');
        process.stdout.write(refContent + '\n');
        process.stdout.write('=== End of Phase Ref ===\n');
      }
    }

    process.exit(0);
  } catch (e) {
    common.debugLog('session-start', 'Error', { error: e.message });
    process.exit(0);
  }
}

main();
