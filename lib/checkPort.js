const net = require("net");
const { execSync } = require("child_process");
const { logError } = require("./utils");

// Check if port is in use, return status and process info
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
    // Check IPv4 (0.0.0.0)
    const serverIPv4 = net.createServer();
    serverIPv4.once("error", async (err) => {
      if (err.code === "EACCES") {
        // Permission denied, check with netstat
        const result = await checkWithNetstat(port);
        resolve(result);
      } else if (err.code === "EADDRINUSE") {
        handlePortInUse(port, resolve);
      } else {
        resolve({ port, status: "error", message: err.message });
      }
      serverIPv4.close();
    });
    serverIPv4.once("listening", () => {
      serverIPv4.close();
      // Check IPv6 (::1)
      checkIPv6(port, resolve);
    });
    serverIPv4.listen(port, "0.0.0.0");
  });
}



// Check IPv6 port status
function checkIPv6(port, resolve) {
  const serverIPv6 = net.createServer();
  serverIPv6.once("error", async (err) => {
    if (err.code === "EACCES") {
      // Permission denied, check with netstat
      const result = await checkWithNetstat(port);
      resolve(result);
    } else if (err.code === "EADDRINUSE") {
      handlePortInUse(port, resolve);
    } else {
      resolve({ port, status: "error", message: err.message });
    }
    serverIPv6.close();
  });
  serverIPv6.once("listening", () => {
    serverIPv6.close();
    resolve({ port, status: "free" });
  });
  serverIPv6.listen(port, "::1");
}

// Check port status using netstat for restricted ports
async function checkWithNetstat(port) {
  try {
    const pid = findPid(port);
    if (pid) {
      const processInfo = await getProcessInfo(pid);
      return {
        port,
        status: "in-use",
        pid,
        processName: processInfo ? processInfo.name : "unknown",
      };
    }
    return { port, status: "free" };
  } catch (e) {
    return { port, status: "error", message: `Failed to check port: ${e.message}` };
  }
}

// Handle port in use, find PID and process info
async function handlePortInUse(port, resolve) {
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
}

// Find PID for port using netstat
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

// Get process info for PID
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

module.exports = { checkPort, getProcessInfo };