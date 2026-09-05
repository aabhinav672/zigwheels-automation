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
 *
 * After a local (non-CI) run, the HTML report cucumber.js writes to
 * reports/cucumber-report.html is opened in Chrome automatically.
 */

const { spawnSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const REPORT_PATH = path.resolve(__dirname, '..', 'reports', 'cucumber-report.html');

/** Opens the HTML report in Chrome, falling back to the OS default browser. */
function openReport(reportPath) {
  const url = `file://${reportPath}`;

  const attempts =
    process.platform === 'darwin'
      ? [['open', ['-a', 'Google Chrome', url]], ['open', [url]]]
      : process.platform === 'win32'
        ? [
            ['cmd', ['/c', 'start', '', 'chrome', url]],
            ['cmd', ['/c', 'start', '', url]],
          ]
        : [
            ['google-chrome', [url]],
            ['xdg-open', [url]],
          ];

  const opened = attempts.some(
    ([cmd, cmdArgs]) => spawnSync(cmd, cmdArgs, { stdio: 'ignore' }).status === 0,
  );

  if (opened) {
    console.log(`[run-bdd] Opened HTML report: ${reportPath}`);
  } else {
    console.warn(`[run-bdd] Could not auto-open the report. View it at: ${reportPath}`);
  }
}

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

if (!process.env.CI && fs.existsSync(REPORT_PATH)) {
  openReport(REPORT_PATH);
}

process.exit(result.status ?? 1);
