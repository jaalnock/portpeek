#!/usr/bin/env node
const { program } = require("commander");
const { checkPort } = require("../lib/checkPort");
const { killPort } = require("../lib/killPort");
const { suggestPorts } = require("../lib/suggestPorts");
const { showInfo } = require("../lib/showInfo");
const { outputResult } = require("../lib/utils");
const { watchPort } = require("../lib/watchPort");

program
  .version("1.0.0")
  .description("A CLI tool to manage and inspect network ports");

program
  .arguments("[ports...]")
  .option("--json", "Output in JSON format")
  .option("--watch", "Watch port status every 3 seconds")
  .option("--log <file>", "Log output to file")
  .action(async (ports, options) => {
    if (ports.length === 0) {
      program.help();
    }
    for (const port of ports) {
      const result = await checkPort(port);
      if (options.watch) {
        await watchPort(port, options);
      } else {
        outputResult(result, options);
      }
    }
  });

program
  .command("suggest <port> [count]")
  .description("Suggest free ports starting from given port")
  .option("--json", "Output in JSON format")
  .option("--log <file>", "Log output to file")
  .action(async (port, count = 4, options) => {
    const result = await suggestPorts(port, parseInt(count));
    outputResult(result, options);
  });

program
  .command("kill <port>")
  .description("Kill the process using the port")
  .option("--log <file>", "Log output to file")
  .action(async (port, options) => {
    const result = await killPort(port);
    outputResult(result, options);
  });

program
  .command("info <port>")
  .description("Show detailed process info for the port")
  .option("--json", "Output in JSON format")
  .option("--log <file>", "Log output to file")
  .action(async (port, options) => {
    const result = await showInfo(port);
    outputResult(result, options);
  });

program
  .command("--help")
  .description("Display help information")
  .action(() => {
    program.help();
  });

program.parse(process.argv);
