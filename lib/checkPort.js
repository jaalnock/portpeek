const net = require("net");
const { execSync } = require("child_process");
const { logError } = require("./utils");

async function checkPort(port) {
  port = parseInt(port);
  if (isNaN(port) || port < 1 || port > 65535) {
    return {
      port,
      status: "invalid",
      message: "Port must be between 1 and 65535",
    };
  }

  return new Promise((resolve) => {
    const server = net.createServer();
    server.once("error", async (err) => {
      if (err.code === "EADDRINUSE") {
        try {
          const pid = findPid(port);
          if (pid) {
            const processInfo = await getProcessInfo(pid);
            resolve({
              port,
              status: "in-use",
              pid,
              processName: processInfo ? processInfo.name : "unknown",
            });
          } else {
            resolve({ port, status: "in-use", message: "Unable to find PID" });
          }
        } catch (e) {
          resolve({
            port,
            status: "in-use",
            message: "Unable to find process info",
          });
        }
      } else {
        resolve({ port, status: "error", message: err.message });
      }
    });
    server.once("listening", () => {
      server.close();
      resolve({ port, status: "free" });
    });
    server.listen(port);
  });
}

function findPid(port) {
  try {
    let output;
    if (process.platform === "win32") {
      output = execSync(`netstat -aon | findstr :${port}`, {
        stdio: "pipe",
      }).toString();
    } else {
      output = execSync(`netstat -tuln -p 2>/dev/null | grep :${port}`, {
        stdio: "pipe",
      }).toString();
    }
    const lines = output
      .split("\n")
      .filter((line) => line.includes(`:${port}`));
    if (lines.length > 0) {
      const parts = lines[0].trim().split(/\s+/);
      return process.platform === "win32"
        ? parts[parts.length - 1]
        : parts[parts.length - 2].split("/")[0];
    }
  } catch (e) {
    logError(`Error finding PID for port ${port}: ${e.message}`);
  }
  return null;
}

async function getProcessInfo(pid) {
  try {
    const psList = (await import("ps-list")).default;
    const processes = await psList();
    return processes.find((p) => p.pid.toString() === pid);
  } catch (e) {
    logError(`Error getting process info for PID ${pid}: ${e.message}`);
    return null;
  }
}

module.exports = { checkPort };
