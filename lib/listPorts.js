const { execSync } = require("child_process");
const { getProcessInfo } = require("./checkPort");
const { logError } = require("./utils");

// List all busy ports with process info, sorted by port number
async function listPorts() {
  try {
    let output;
    if (process.platform === "win32") {
      output = execSync("netstat -aon | findstr LISTENING", { stdio: "pipe" }).toString();
    } else if (process.platform === "linux" || process.platform === "darwin") {
      output = execSync("lsof -iTCP -sTCP:LISTEN -P -n", { stdio: "pipe" }).toString();
    } else {
      return [{ status: "error", message: `Unsupported platform: ${process.platform}` }];
    }

    if (!output.trim()) {
      return [{ status: "error", message: "No listening ports found" }];
    }

    const portMap = new Map();
    if (process.platform === "win32") {
      const lines = output.split("\n").filter((line) => line.includes("LISTENING"));
      for (const line of lines) {
        const parts = line.trim().split(/\s+/);
        const address = parts[1];
        const pid = parts[parts.length - 1];
        const port = address.split(":").pop();
        if (!isNaN(parseInt(port))) {
          portMap.set(parseInt(port), pid);
        }
      }
    } else if (process.platform === "linux" || process.platform === "darwin") {
      const lines = output.split("\n").slice(1); // Skip header
      for (const line of lines) {
        const parts = line.trim().split(/\s+/);
        if (parts.length >= 9) {
          const pid = parts[1];
          const address = parts[8];
          const port = address.includes(":") ? address.split(":").pop() : null;
          if (port && !isNaN(parseInt(port))) {
            portMap.set(parseInt(port), pid);
          }
        }
      }
    }

    // Convert to array and sort by port
    const ports = Array.from(portMap, ([port, pid]) => ({ port, pid }))
      .sort((a, b) => a.port - b.port);

    // Get process info for each port
    const results = [];
    for (const { port, pid } of ports) {
      const processInfo = await getProcessInfo(pid);
      results.push({
        port,
        status: "in-use",
        pid,
        processName: processInfo ? processInfo.name : "unknown",
      });
    }

    return results.length ? results : [{ status: "error", message: "No listening ports found" }];
  } catch (e) {
    logError(`Error listing ports: ${e.message}`);
    return [{ status: "error", message: `Failed to list ports: ${e.message}` }];
  }
}

module.exports = { listPorts };