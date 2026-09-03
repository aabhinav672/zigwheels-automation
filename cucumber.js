// Type-checking the whole support/step-definition tree on every run is slow
// and picks up strict-mode issues (noUnusedParameters, etc.) that don't matter
// for a transpile step - so ts-node only transpiles here.
process.env.TS_NODE_TRANSPILE_ONLY = 'true';

/**
 * Cucumber runner config.
 *
 *   npm run test:bdd                        runs every scenario
 *   npm run test:bdd -- --tag=@smoke        runs scenarios tagged @smoke
 *   npm run test:bdd -- --tag="@regression and not @bikes"
 *
 * See package.json's `test:bdd*` scripts and scripts/run-bdd.js.
 */
module.exports = {
  default: {
    paths: ['features/**/*.feature'],
    require: ['src/bdd/**/*.ts'],
    requireModule: ['ts-node/register', 'tsconfig-paths/register'],
    format: [
      'progress-bar',
      ['html', 'reports/cucumber-report.html'],
      ['json', 'reports/cucumber-report.json'],
    ],
    formatOptions: { snippetInterface: 'async-await' },
    publish: false,
  },
};
