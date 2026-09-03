#!/usr/bin/env node
'use strict';

/**
 * Single entry point for running the Cucumber suite with an optional tag
 * expression, so the tag lives in one place instead of a family of npm
 * scripts:
 *
 *   npm run test:bdd                             all scenarios
 *   npm run test:bdd -- --tag=@smoke             one tag
 *   npm run test:bdd -- --tag="@regression and not @bikes"   full expression
 *
 * Anything else passed after `--` (e.g. `--parallel 2`) is forwarded to
 * cucumber-js untouched.
 */

const { spawnSync } = require('child_process');

const args = process.argv.slice(2);
const tagFlagIndex = args.findIndex((arg) => arg === '--tag' || arg.startsWith('--tag='));

let tagExpression;
let passthrough = args;

if (tagFlagIndex !== -1) {
  const flag = args[tagFlagIndex];
  if (flag.startsWith('--tag=')) {
    tagExpression = flag.slice('--tag='.length);
    passthrough = [...args.slice(0, tagFlagIndex), ...args.slice(tagFlagIndex + 1)];
  } else {
    tagExpression = args[tagFlagIndex + 1];
    passthrough = [...args.slice(0, tagFlagIndex), ...args.slice(tagFlagIndex + 2)];
  }
}

const cucumberArgs = [...passthrough];
if (tagExpression) {
  cucumberArgs.push('--tags', tagExpression);
  console.log(`[run-bdd] Running scenarios matching tag expression: ${tagExpression}`);
} else {
  console.log('[run-bdd] Running all scenarios (no --tag supplied).');
}

const result = spawnSync('npx', ['cucumber-js', ...cucumberArgs], {
  stdio: 'inherit',
  shell: process.platform === 'win32',
});

process.exit(result.status ?? 1);
