const { execSync } = require('child_process');
const { getProcessInfo } = require('./checkPort');
const { logError } = require('./utils');

// List all busy ports with process info, sorted by port number
async function listPorts() {
  try {
    let output;
    if (process.platform === 'win32') {
      output = execSync('netstat -aon | findstr LISTENING', { stdio: 'pipe' }).toString();
    } else {
      output = execSync('netstat -tuln -p 2>/dev/null | grep LISTEN', { stdio: 'pipe' }).toString();
    }

    if (!output.trim()) {
      return [{ status: 'error', message: 'No listening ports found' }];
    }

    const portMap = new Map();
    const lines = output.split('\n').filter(line => line.includes('LISTENING') || line.includes('LISTEN'));
    for (const line of lines) {
      const parts = line.trim().split(/\s+/);
      let port, pid;
      if (process.platform === 'win32') {
        const address = parts[1];
        pid = parts[parts.length - 1];
        port = address.split(':').pop();
      } else {
        const address = parts[3];
        pid = parts[parts.length - 2].split('/')[0];
        port = address.split(':').pop();
      }
      if (!isNaN(parseInt(port)) && !portMap.has(parseInt(port))) {
        portMap.set(parseInt(port), pid);
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
        status: 'in-use',
        pid,
        processName: processInfo ? processInfo.name : 'unknown',
      });
    }

    return results.length ? results : [{ status: 'error', message: 'No listening ports found' }];
  } catch (e) {
    logError(`Error listing ports: ${e.message}`);
    return [{ status: 'error', message: `Failed to list ports: ${e.message}` }];
  }
}

module.exports = { listPorts };