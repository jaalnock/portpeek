const chalk = require("chalk");
const { checkPort } = require("./checkPort");
const { outputResult } = require("./utils");

async function watchPort(port, options) {
  console.log(chalk.cyan(`Watching port ${port}... Press Ctrl+C to stop`));

  // Continuously check port status every 3 seconds
  while (true) {
    const result = await checkPort(port);
    outputResult(result, options); // Display the result using formatting options
    await new Promise((resolve) => setTimeout(resolve, 3000)); // Wait 3 seconds before next check
  }
}

module.exports = { watchPort };
