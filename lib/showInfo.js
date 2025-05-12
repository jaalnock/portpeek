const { checkPort } = require("./checkPort");
const { logError } = require("./utils");

async function showInfo(port) {
  const result = await checkPort(port);
  if (result.status !== "in-use" || !result.pid) {
    return {
      port,
      status: "error",
      message: "Port is not in use or no process found",
    };
  }

  try {
    const psList = (await import("ps-list")).default;
    const processes = await psList();
    const process = processes.find((p) => p.pid.toString() === result.pid);
    if (!process) {
      return { port, status: "error", message: "Process not found" };
    }

    const info = {
      name: process.name,
      pid: process.pid.toString(),
      memory: `${(process.memory / 1024 / 1024).toFixed(2)} MB`,
      cmd: process.cmd || "N/A",
    };

    return { port, status: "success", info };
  } catch (e) {
    logError(`Error getting process info: ${e.message}`);
    return {
      port,
      status: "error",
      message: `Failed to get process info: ${e.message}`,
    };
  }
}

module.exports = { showInfo };
