const { checkPort } = require("./checkPort");
const { execSync } = require("child_process");
const inquirer = require("inquirer");
const { logError } = require("./utils");

async function killPort(port) {
  const result = await checkPort(port);
  if (result.status !== "in-use" || !result.pid) {
    return {
      port,
      status: "error",
      message: "Port is not in use or no process found",
    };
  }

  const { confirm } = await inquirer.prompt([
    {
      type: "confirm",
      name: "confirm",
      message: `Kill process ${result.pid} using port ${port}?`,
      default: false,
    },
  ]);

  if (!confirm) {
    return { port, status: "aborted", message: "Kill operation cancelled" };
  }

  try {
    if (process.platform === "win32") {
      execSync(`taskkill /PID ${result.pid} /F`, { stdio: "pipe" });
    } else {
      execSync(`kill -9 ${result.pid}`, { stdio: "pipe" });
    }
    return { port, status: "success", message: `Process ${result.pid} killed` };
  } catch (e) {
    logError(`Error killing process ${result.pid}: ${e.message}`);
    return {
      port,
      status: "error",
      message: `Failed to kill process: ${e.message}`,
    };
  }
}

module.exports = { killPort };
