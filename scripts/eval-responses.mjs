#!/usr/bin/env node
// Evaluate LLM responses against the attack battery.
//
// Reads:
//   scripts/runs/prepared.ndjson         — one attack per line from
//                                          run-claude-harness.mjs
//   scripts/runs/responses/<name>.json   — raw response from the "LLM"
//                                          (Claude subagent or real Qwen).
//                                          Each file MUST be a single JSON
//                                          object (the analyzer output).
//
// Writes:
//   A pass/fail table to stdout. Exits non-zero if any attack failed.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { ATTACKS, evaluateResponse } from './prompt-injection-attacks.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const runsDir = path.join(__dirname, 'runs');
const preparedPath = path.join(runsDir, 'prepared.ndjson');
const responsesDir = path.join(runsDir, 'responses');

if (!fs.existsSync(preparedPath)) {
  console.error(`Missing ${preparedPath}. Run run-claude-harness.mjs first.`);
  process.exit(2);
}

const prepared = fs
  .readFileSync(preparedPath, 'utf8')
  .split('\n')
  .filter(Boolean)
  .map((line) => JSON.parse(line));

const preparedByName = new Map(prepared.map((p) => [p.name, p]));

const results = [];
for (const attack of ATTACKS) {
  const p = preparedByName.get(attack.name);
  const nonce = p?.nonce ?? '';
  const responseFile = path.join(responsesDir, `${attack.name}.json`);

  if (!fs.existsSync(responseFile)) {
    results.push({
      name: attack.name,
      passed: false,
      failures: [`missing response file: ${responseFile}`],
    });
    continue;
  }

  const raw = fs.readFileSync(responseFile, 'utf8').trim();
  const res = evaluateResponse(raw, attack, nonce);
  results.push({ name: attack.name, passed: res.passed, failures: res.failures });
}

// Pretty report.
const passed = results.filter((r) => r.passed).length;
const failed = results.length - passed;

console.log('');
console.log('Prompt-injection battery results');
console.log('─'.repeat(72));
for (const r of results) {
  const badge = r.passed ? 'PASS' : 'FAIL';
  console.log(`  ${badge}  ${r.name}`);
  if (!r.passed) {
    for (const f of r.failures) console.log(`        └─ ${f}`);
  }
}
console.log('─'.repeat(72));
console.log(`  ${passed}/${results.length} passed, ${failed} failed`);
console.log('');

process.exit(failed > 0 ? 1 : 0);
