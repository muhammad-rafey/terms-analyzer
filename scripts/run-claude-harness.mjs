#!/usr/bin/env node
// Prepared-prompt emitter for the prompt-injection battery.
//
// Runs each attack payload through the same sanitize + wrap pipeline the
// Next.js API route uses, then prints the full system/user prompt pair as
// NDJSON to stdout so a Claude subagent loop (or a future HTTP runner) can
// consume them.
//
// Usage:
//   node scripts/run-claude-harness.mjs            # NDJSON to stdout
//   node scripts/run-claude-harness.mjs --filter ignore_previous
//   node scripts/run-claude-harness.mjs --json     # pretty JSON array
//
// Output schema per line:
//   { name, description, nonce, systemPrompt, userMessage, expect }

import { ATTACKS, applyDefensePipeline } from './prompt-injection-attacks.mjs';

const args = process.argv.slice(2);
const filterIdx = args.indexOf('--filter');
const filter = filterIdx >= 0 ? args[filterIdx + 1] : null;
const pretty = args.includes('--json');

const selected = filter
  ? ATTACKS.filter((a) => a.name === filter || a.name.includes(filter))
  : ATTACKS;

if (selected.length === 0) {
  console.error(`No attacks matched filter "${filter}".`);
  console.error(`Available: ${ATTACKS.map((a) => a.name).join(', ')}`);
  process.exit(2);
}

const prepared = selected.map((attack) => {
  const { nonce, systemPrompt, userMessage, sanitized } = applyDefensePipeline(
    attack.payload
  );
  return {
    name: attack.name,
    description: attack.description,
    nonce,
    systemPrompt,
    userMessage,
    sanitizedLength: sanitized.length,
    rawLength: attack.payload.length,
    expect: attack.expect,
  };
});

if (pretty) {
  process.stdout.write(JSON.stringify(prepared, null, 2) + '\n');
} else {
  for (const p of prepared) {
    process.stdout.write(JSON.stringify(p) + '\n');
  }
}

// Human summary on stderr.
console.error(`Prepared ${prepared.length} attack(s).`);
for (const p of prepared) {
  const dropped = p.rawLength - p.sanitizedLength;
  console.error(
    `  - ${p.name.padEnd(22)} raw=${p.rawLength}B sanitized=${p.sanitizedLength}B dropped=${dropped}B`
  );
}
