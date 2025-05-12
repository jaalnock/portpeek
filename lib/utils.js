const chalk = require("chalk");
const fs = require("fs").promises;

// Log error message in red
function logError(message) {
  console.error(chalk.red(`Error: ${message}`));
}

// Format result based on its status and user options
function formatOutput(result, options) {
  if (options.json) {
    return JSON.stringify(result, null, 2); // Return raw JSON if requested
  }

  if (Array.isArray(result)) {
    // Handle array of results (e.g., list command)
    const outputs = result.map(item => {
      if (item.status === "in-use") {
        return chalk.red(
          `Port ${item.port} is in use by ${item.processName || "unknown"} (PID ${item.pid || "unknown"})`
        );
      } else if (item.status === "error") {
        return chalk.red(`Error: ${item.message}`);
      } else {
        return chalk.yellow(`Port ${item.port}: ${item.status || "Unknown result"}`);
      }
    });
    return outputs.join("\n");
  }

  // Handle single result
  let output = "";
  if (result.status === "in-use") {
    output = chalk.red(
      `Port ${result.port} is in use by ${result.processName || "unknown"} (PID ${result.pid || "unknown"})`
    );
  } else if (result.status === "free") {
    output = chalk.green(`Port ${result.port} is free`);
  } else if (result.status === "invalid") {
    output = chalk.red(`Invalid port: ${result.message}`);
  } else if (result.ports) {
    output = chalk.green(`Free ports: ${result.ports.join(", ")}`);
  } else if (result.info) {
    // Display detailed info for a process using the port
    output = chalk.cyan(
      `Port ${result.port} info:\n` +
      `Name: ${result.info.name}\n` +
      `PID: ${result.info.pid}\n` +
      `Memory: ${result.info.memory}\n` +
      `Command: ${result.info.cmd}`
    );
  } else {
    output = chalk.yellow(result.message || "Unknown result");
  }
  return output;
}

// Print the output to console and optionally log it to a file
async function outputResult(result, options) {
  const output = formatOutput(result, options);
  console.log(output);
  if (options.log) {
    const lineEnding = process.platform === "win32" ? "\r\n" : "\n";
    await fs.appendFile(
      options.log,
      `${new Date().toISOString()} - ${output}${lineEnding}`
    );
  }
}

module.exports = { logError, outputResult };