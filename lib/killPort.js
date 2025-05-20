import { checkPort } from "./checkPort.js";
import { execSync } from "child_process";
import { logError } from "./utils.js";

// Dynamic import of ESM-only inquirer
const inquirer = (await import("inquirer")).default;

export async function killPort(port) {
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
    return {
      port,
      status: "aborted",
      message: "Kill operation cancelled",
    };
  }

  try {
    if (process.platform === "win32") {
      execSync(`taskkill /PID ${result.pid} /F`, { stdio: "pipe" });
    } else if (process.platform === "linux" || process.platform === "darwin") {
      execSync(`kill -9 ${result.pid}`, { stdio: "pipe" });
    } else {
      throw new Error(`Unsupported platform: ${process.platform}`);
    }

    return {
      port,
      status: "success",
      message: `Process ${result.pid} killed`,
    };
  } catch (e) {
    logError(`Error killing process ${result.pid}: ${e.message}`);
    return {
      port,
      status: "error",
      message: `Failed to kill process: ${e.message}`,
    };
  }
}
