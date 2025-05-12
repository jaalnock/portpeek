const { checkPort } = require("./checkPort");

async function suggestPorts(startPort, count = 4) {
  const results = [];
  let port = parseInt(startPort);

  // Validate the start port
  if (isNaN(port) || port < 1 || port > 65535) {
    return { status: "error", message: "Invalid start port" };
  }

  // Find the next `count` number of free ports
  while (results.length < count && port <= 65535) {
    const result = await checkPort(port);
    if (result.status === "free") {
      results.push(port);
    }
    port++;
  }

  if (results.length === 0) {
    return { status: "error", message: "No free ports found" };
  }

  return { status: "success", ports: results };
}

module.exports = { suggestPorts };
