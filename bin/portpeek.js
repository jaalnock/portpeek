#!/usr/bin/env node
const { program } = require('commander');
const { checkPort } = require('../lib/checkPort');
const { killPort } = require('../lib/killPort');
const { suggestPorts } = require('../lib/suggestPorts');
const { showInfo } = require('../lib/showInfo');
const { outputResult } = require('../lib/utils');
const { watchPort } = require('../lib/watchPort');
const { listPorts } = require('../lib/listPorts');
const pkg = require('../package.json');

// Define shared options
const sharedOptions = [
  ['-j, --json', 'Output in JSON format'],
  ['-l, --log [file]', 'Log output to a file (default: portpeek.log)']
];

program
  .name("portpeek")
  .description("A CLI tool to manage and inspect network ports")
  .version(pkg.version);

// Apply global options
sharedOptions.forEach(([option, description]) => {
  program.option(option, description);
});

program
  .arguments('[ports...]')
  .option('-w, --watch', 'Watch port status every 3 seconds')
  .action(async (ports, options) => {
    if (ports.length === 0) {
      program.help();
    }
    for (const port of ports) {
      const result = await checkPort(port);
      if (options.watch || program.opts().watch) {
        await watchPort(port, { ...program.opts(), ...options });
      } else {
        await outputResult(result, { ...program.opts(), ...options });
      }
    }
  });

program
  .command('suggest')
  .description('Suggest free ports starting from given port')
  .arguments('<port> [count]')
  .option('-j, --json', 'Output in JSON format')
  .option('-l, --log [file]', 'Log output to a file (default: portpeek.log)')
  .action(async function (port, count = 4) {
    const options = { ...program.opts(), ...this.opts() };
    const result = await suggestPorts(port, parseInt(count));
    if (result.status === 'success') {
      result.status = 'free';
    }
    await outputResult(result, options);
  });

program
  .command('kill')
  .description('Kill the process using the port')
  .arguments('<port>')
  .option('-j, --json', 'Output in JSON format')
  .option('-l, --log [file]', 'Log output to a file (default: portpeek.log)')
  .action(async function (port) {
    const options = { ...program.opts(), ...this.opts() };
    const result = await killPort(port);
    await outputResult(result, options);
  });

program
  .command('info')
  .description('Show detailed process info for the port')
  .arguments('<port>')
  .option('-j, --json', 'Output in JSON format')
  .option('-l, --log [file]', 'Log output to a file (default: portpeek.log)')
  .action(async function (port) {
    const options = { ...program.opts(), ...this.opts() };
    const result = await showInfo(port);
    await outputResult(result, options);
  });

program
  .command('list')
  .description('List all busy ports with process info')
  .option('-j, --json', 'Output in JSON format')
  .option('-l, --log [file]', 'Log output to a file (default: portpeek.log)')
  .action(async function () {
    const options = { ...program.opts(), ...this.opts() };
    const results = await listPorts();
    await outputResult(results, options);
  });

program.parse(process.argv);