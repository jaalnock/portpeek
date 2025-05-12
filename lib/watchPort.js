const chalk = require("chalk");
const { checkPort } = require("./checkPort");
const { outputResult } = require("./utils");

async function watchPort(port, options) {
  console.log(chalk.cyan(`Watching port ${port}... Press Ctrl+C to stop`));
  while (true) {
    const result = await checkPort(port);
    outputResult(result, options);
    await new Promise((resolve) => setTimeout(resolve, 3000));
  }
}

module.exports = { watchPort };
