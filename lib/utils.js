import chalk from "chalk";
import fs from "fs/promises";
import path from "path";

// Log error message in red
export function logError(message) {
  console.error(chalk.red(`Error: ${message}`));
}

// Strip chalk colors for logging
export function stripColors(text) {
  return text.replace(/\x1B[[(?);]{0,2}(;?\d)*?.*?m/g, '');
}

// Format JSON with consistent colors
export function formatJsonWithColors(obj, indent = 0) {
  const indentStr = " ".repeat(indent * 2);

  if (Array.isArray(obj)) {
    if (obj.length === 0) return `${indentStr}[]`;
    const items = obj.map(item => `${indentStr}  ${formatJsonWithColors(item, indent + 1)}`);
    return `${indentStr}[\n${items.join(",\n")}\n${indentStr}]`;
  }

  if (obj === null) {
    return chalk.gray("null");
  }

  if (typeof obj === 'object') {
    const keys = Object.keys(obj);
    if (keys.length === 0) return `${indentStr}{}`;
    const items = keys.map(key => {
      const value = obj[key];
      const coloredKey = chalk.yellow(`"${key}"`);
      let coloredValue = formatJsonWithColors(value, indent + 1);

      if (key === "port" && typeof value === "number") {
        coloredValue = chalk.cyan.bold(value);
      }

      return `${indentStr}  ${coloredKey}: ${coloredValue}`;
    });
    return `${indentStr}{\n${items.join(",\n")}\n${indentStr}}`;
  }

  if (typeof obj === 'string') {
    return chalk.green(`"${obj}"`);
  }

  if (typeof obj === 'number') {
    return chalk.cyan.bold(`${obj}`);
  }

  if (typeof obj === 'boolean') {
    return chalk.magenta(`${obj}`);
  }

  return `${indentStr}${obj}`;
}

// Format result based on its status and user options
export function formatOutput(result, options = {}) {
  if (options.json) {
    return formatJsonWithColors(result); // Colored JSON
  }

  if (Array.isArray(result)) {
    let output = chalk.red.bold("Active Ports:");
    const outputs = result.map(item => {
      if (!item || typeof item !== 'object') {
        return chalk.yellow(`  Invalid result: ${JSON.stringify(item)}`);
      }
      if (item.status === "in-use") {
        return chalk.yellow(
          `  Port ${chalk.cyan.bold(item.port)} is in use by ${chalk.cyan(item.processName || "unknown")} (PID ${chalk.cyan(item.pid || "unknown")})`
        );
      } else if (item.status === "error") {
        return chalk.yellow(`  Error: ${item.message || "Unknown error"}`);
      } else if (item.status) {
        return chalk.yellow(`  Port ${chalk.cyan.bold(item.port)}: ${item.status}`);
      } else {
        return chalk.yellow(`  Invalid result: ${JSON.stringify(item)}`);
      }
    });
    return output + "\n" + outputs.join("\n");
  }

  if (!result || typeof result !== 'object') {
    return chalk.yellow(`Invalid result: ${JSON.stringify(result)}`);
  }

  let output = "";
  if (result.status === "in-use") {
    output = chalk.red.bold("Port Status:") + "\n" +
      chalk.yellow(`  Port ${chalk.cyan.bold(result.port)} is in use by ${chalk.cyan(result.processName || "unknown")} (PID ${chalk.cyan(result.pid || "unknown")})`);
  } else if (result.status === "free" && result.port) {
    output = chalk.red.bold("Port Status:") + "\n" +
      chalk.green(`  Port ${chalk.cyan.bold(result.port)} is free`);
  } else if (result.status === "invalid") {
    output = chalk.red.bold("Port Status:") + "\n" +
      chalk.yellow(`  Invalid port: ${result.message || "Unknown error"}`);
  } else if (result.status === "killed") {
    output = chalk.red.bold("Port Action:") + "\n" +
      chalk.green(`  Port ${chalk.cyan.bold(result.port)} process killed`);
  } else if (result.status === "error") {
    output = chalk.red.bold("Port Status:") + "\n" +
      chalk.yellow(`  Error: ${result.message || "Unknown error"}`);
  } else if (result.ports) {
    output = chalk.red.bold("Suggested Ports:") + "\n" +
      chalk.green(`  Free ports: ${result.ports.map(p => chalk.cyan.bold(p)).join(", ")}`);
  } else if (result.info) {
    output = chalk.red.bold("Port Info:") + "\n" +
      chalk.cyan(
        `  Name: ${result.info.name || "unknown"}\n` +
        `  PID: ${result.info.pid || "unknown"}\n` +
        `  Memory: ${result.info.memory || "unknown"}\n` +
        `  CPU: ${result.info.cpu || "unknown"}\n`
      );
  } else if (result.status === "success" && result.message) {
    output = chalk.green.bold("Success:") + "\n" +
      chalk.green(`  ${result.message}`);
  } else {
    output = chalk.yellow(`Result: ${JSON.stringify(result)}`);
  }

  return output;
}

// Print the output to console and optionally log it to a file
export async function outputResult(result, options = {}) {
  const output = formatOutput(result, options);
  console.log(output);

  if (options.log) {
    const logFile = path.resolve(options.log === true ? 'portpeek.log' : options.log);
    const lineEnding = process.platform === "win32" ? "\r\n" : "\n";
    try {
      await fs.mkdir(path.dirname(logFile), { recursive: true });
      await fs.appendFile(
        logFile,
        `${new Date().toISOString()} - ${stripColors(output)}${lineEnding}`,
        { encoding: 'utf8', flag: 'a+' }
      );
      console.log(`\nLog file "${path.basename(logFile)}" generated successfully`);
    } catch (err) {
      logError(`Failed to write to log file ${logFile}: ${err.message}`);
    }
  }
}
