#!/usr/bin/env node
'use strict';

/**
 * Interactive Cucumber runner.
 *
 * Meant to be launched via `npm run runner` (e.g. by clicking the "Run
 * Script" affordance VS Code shows when you hover a script in package.json).
 * With no arguments it scans every `.feature` file for its tags and lets you
 * pick one from a type-to-filter list, then runs cucumber-js filtered to
 * that tag.
 *
 * Arguments (all optional, combinable):
 *   npm run runner -- @smoke                 skip the prompt, run this tag
 *   npm run runner -- --tag=@smoke           same, explicit flag form
 *   npm run runner -- --parallel             run with 2 workers
 *   npm run runner -- --parallel=3           run with 3 workers
 *   npm run runner -- @smoke --parallel      combine tag + parallel
 *
 * For non-interactive use (CI, one-liners) see `npm run test:bdd -- --tag=...`
 * (scripts/run-bdd.js) instead.
 */

const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');
const prompts = require('prompts');

const FEATURES_DIR = path.join(__dirname, '..', 'features');
const TAG_PATTERN = /@[\w-]+/g;
const DEFAULT_PARALLEL_WORKERS = 2;

function collectTags(dir) {
  const tags = new Set();
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      for (const tag of collectTags(fullPath)) tags.add(tag);
    } else if (entry.isFile() && entry.name.endsWith('.feature')) {
      const content = fs.readFileSync(fullPath, 'utf8');
      for (const line of content.split('\n')) {
        const trimmed = line.trim();
        if (!trimmed.startsWith('@')) continue;
        for (const tag of trimmed.match(TAG_PATTERN) ?? []) tags.add(tag);
      }
    }
  }
  return tags;
}

/** Reads `@tag`/`--tag=<expr>` and `--parallel[=<n>]` out of the CLI args. */
function parseArgs(argv) {
  let tagExpression;
  let parallelWorkers;

  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];

    if (arg.startsWith('--tag=')) {
      tagExpression = arg.slice('--tag='.length);
    } else if (arg === '--tag') {
      tagExpression = argv[++i];
    } else if (arg.startsWith('--parallel=')) {
      parallelWorkers = Number(arg.slice('--parallel='.length));
    } else if (arg === '--parallel') {
      const next = argv[i + 1];
      const hasExplicitCount = next !== undefined && /^\d+$/.test(next);
      parallelWorkers = hasExplicitCount ? Number(argv[++i]) : DEFAULT_PARALLEL_WORKERS;
    } else if (arg.startsWith('@')) {
      tagExpression = arg;
    }
  }

  return { tagExpression, parallelWorkers };
}

async function promptForTag() {
  const tags = Array.from(collectTags(FEATURES_DIR)).sort();

  const { tagExpression } = await prompts({
    type: 'autocomplete',
    name: 'tagExpression',
    message: 'Which tag do you want to run?',
    choices: [
      { title: 'All scenarios (no filter)', value: '' },
      ...tags.map((tag) => ({ title: tag, value: tag })),
    ],
  });

  if (tagExpression === undefined) {
    console.log('[runner] Cancelled.');
    process.exit(0);
  }

  return tagExpression;
}

async function main() {
  const { tagExpression: tagFromArgs, parallelWorkers } = parseArgs(process.argv.slice(2));
  const tagExpression = tagFromArgs ?? (await promptForTag());

  const cucumberArgs = [];
  if (tagExpression) cucumberArgs.push('--tags', tagExpression);
  if (parallelWorkers) cucumberArgs.push('--parallel', String(parallelWorkers));

  console.log(
    tagExpression
      ? `[runner] Running scenarios tagged: ${tagExpression}`
      : '[runner] Running all scenarios.',
  );
  if (parallelWorkers) {
    console.log(`[runner] Running with ${parallelWorkers} parallel workers.`);
  }

  const result = spawnSync('npx', ['cucumber-js', ...cucumberArgs], {
    stdio: 'inherit',
    shell: process.platform === 'win32',
  });

  process.exit(result.status ?? 1);
}

main();
