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
portpeek [command] [options]
```

### Core Commands

**`portpeek <port>`**  
Check if a single port is in use

**`portpeek <port1> <port2> ...`**  
Check the status of multiple ports

**`portpeek suggest <port> [count]`**  
Suggest `count` free ports starting from `port`

**`portpeek kill <port>`**  
Terminate the process using the specified port

**`portpeek info <port>`**  
Display detailed information about the process using the port

**`portpeek list`**  
List all busy ports with process names and PIDs, sorted by port number

**`portpeek --help`**  
Show comprehensive help information

### Options

**`--json`**  
Format output as JSON for scripting and automation

**`--watch`**  
Monitor port status with automatic refresh every 3 seconds

**`--log <file>`**  
Save command output to the specified log file

## Examples

### Basic Port Check

```bash
portpeek 8080
```

### Check Multiple Ports

```bash
portpeek 8080 3000 5432
```

### Find Available Ports

```bash
portpeek suggest 8000 5
```

### Terminate Process Using a Port

```bash
portpeek kill 8080
```

### View Detailed Process Information

```bash
portpeek info 8080
```

### List All Busy Ports

```bash
portpeek list
```

### List Busy Ports in JSON Format

```bash
portpeek list --json
```

### JSON Output for Scripting

```bash
portpeek 8080 --json
```

### Real-time Port Monitoring

```bash
portpeek 8080 --watch
```

### Log Results to File

```bash
portpeek 8080 --log output.log
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