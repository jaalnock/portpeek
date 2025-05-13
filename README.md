# Port Peek CLI

[![npm version](https://badge.fury.io/js/portpeek.svg)](https://www.npmjs.com/package/portpeek)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Platforms](https://img.shields.io/badge/platforms-Windows%20%7C%20Linux%20%7C%20macOS-blue)](https://github.com/jaalnock/portpeek)

A robust cross-platform command-line utility for efficient network port management and inspection. Seamlessly works across Windows, Linux, and macOS environments.

## Features

- Check port status and identify processes using specific ports
- Monitor multiple ports simultaneously
- Discover available ports for your applications
- Terminate processes occupying specific ports
- Display detailed process information
- List all busy ports with process details
- Watch port status in real-time
- Export results in JSON format for programmatic use

## Installation

```bash
npm install -g portpeek
```

## Usage

```bash
portpeek [command] [ports...] [options]
```

Run `portpeek --help` for a detailed list of commands and options.

## Core Commands

- **`portpeek <port>`**  
  Checks if a single port is in use.  
  ```bash
  portpeek 8080
  ```

- **`portpeek <port1> <port2> ...`**  
  Checks the status of multiple ports.  
  ```bash
  portpeek 8080 3000 5432
  ```

- **`portpeek suggest <port> [count]`**  
  Suggests `count` free ports starting from `port` (default: 4).  
  ```bash
  portpeek suggest 8000 5
  ```

- **`portpeek kill <port>`**  
  Terminates the process using the specified port.  
  ```bash
  portpeek kill 8080
  ```

- **`portpeek info <port>`**  
  Displays detailed information about the process using the port.  
  ```bash
  portpeek info 8080
  ```

- **`portpeek list`**  
  Lists all busy ports with process names and PIDs, sorted by port number.  
  ```bash
  portpeek list
  ```

## Options

- **`-j, --json`**  
  Outputs results in colored JSON format, ideal for scripting and automation.  
  ```bash
  portpeek 8080 --json
  ```

- **`-l, --log [file]`**  
  Saves command output to a log file (defaults to `portpeek.log` in the current directory).  
  ```bash
  portpeek 8080 --log
  portpeek 8080 --log custom.log
  ```

- **`-w, --watch`**  
  Monitors port status with updates every 3 seconds.  
  ```bash
  portpeek 8080 --watch
  ```

## Examples

### Basic Port Check
Check if port 8080 is in use.

```bash
portpeek 8080
```

**Output**:
```
Port Status:
  Port 8080 is free
```

### Check Multiple Ports with Logging
Check the status of multiple ports and log the output.

```bash
portpeek 8080 3000 5432 --log
```

**Output**:
```
Port Status:
  Port 8080 is free
Port Status:
  Port 3000 is free
Port Status:
  Port 5432 is in use by postgres.exe (PID 6304)
```

**Log File** (`portpeek.log`):
```
2025-05-14T00:00:00.000Z - Port Status:
2025-05-14T00:00:00.000Z -   Port 8080 is free
2025-05-14T00:00:00.000Z - Port Status:
2025-05-14T00:00:00.000Z -   Port 3000 is free
2025-05-14T00:00:00.000Z - Port Status:
2025-05-14T00:00:00.000Z -   Port 5432 is in use by postgres.exe (PID 6304)
```

### Find Available Ports in JSON
Suggest five free ports starting from 8000 in JSON format.

```bash
portpeek suggest 8000 5 --json
```

**Output**:
```json
{
  "status": "free",
  "ports": [
    8000,
    8001,
    8002,
    8003,
    8004
  ]
}
```

### Terminate Process Using a Port
Attempt to kill the process on port 8080 and log the result.

```bash
portpeek kill 8080 --log custom.log
```

**Output**:
```
Port Status:
  Error: Port is not in use or no process found
```

**Log File** (`custom.log`):
```
2025-05-14T00:00:00.000Z - Port Status:
2025-05-14T00:00:00.000Z -   Error: Port is not in use or no process found
```

### View Detailed Process Information
Get detailed info about the process using port 5432.

```bash
portpeek info 5432
```

**Output**:
```
Port Info:
  Name: postgres.exe
  PID: 6304
  Memory: 25.3 MB
  Command: postgres -D /var/lib/pgsql/data
```

### List All Busy Ports
List all ports currently in use.

```bash
portpeek list
```

**Output**:
```
Active Ports:
  Port 135 is in use by svchost.exe (PID 1516)
  Port 139 is in use by System (PID 4)
  ...
```

### List Busy Ports in JSON with Logging
List busy ports in JSON format and save to the default log file.

```bash
portpeek list --json --log
```

**Output**:
```json
[
  {
    "port": 135,
    "status": "in-use",
    "pid": "1516",
    "processName": "svchost.exe"
  },
  ...
]
```

**Log File** (`portpeek.log`):
```
2025-05-14T00:00:00.000Z - [
2025-05-14T00:00:00.000Z -   {
2025-05-14T00:00:00.000Z -     "port": 135,
2025-05-14T00:00:00.000Z -     "status": "in-use",
2025-05-14T00:00:00.000Z -     "pid": "1516",
2025-05-14T00:00:00.000Z -     "processName": "svchost.exe"
2025-05-14T00:00:00.000Z -   },
2025-05-14T00:00:00.000Z -   ...
2025-05-14T00:00:00.000Z - ]
```

### Real-time Port Monitoring
Monitor port 8080 with real-time updates.

```bash
portpeek 8080 --watch
```

**Output** (updates every 3 seconds):
```
Port Status:
  Port 8080 is free
```

## Troubleshooting

**Permission denied**  
On Linux/macOS, some operations require elevated privileges. Try using `sudo` when necessary.

**Windows `netstat` errors**  
Verify that `netstat` is available in your system PATH. It's included in Windows by default.

**Missing process information**  
Ensure the target process is still running and you have sufficient permissions to access its details.

## Platform Support

- Windows (7, 10, 11)
- Linux (Ubuntu, Debian, CentOS, and other major distributions)
- macOS (10.15 Catalina and later)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

Developed with ❤️ by **jaalnock**

• [Support this project](https://github.com/jaalnock)  
• [Report an issue](https://github.com/jaalnock/portpeek/issues)  
• [Contact me](mailto:your-email@example.com)