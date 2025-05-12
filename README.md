# Port Peek CLI

[![npm version](https://badge.fury.io/js/portpeek.svg)](https://www.npmjs.com/package/portpeek)

A cross-platform command-line tool to manage and inspect network ports. Works on Windows, Linux, and macOS.

## Installation

Install globally via npm:

```bash
npm install -g portpeek
```

## Usage

```bash
portpeek [command] [options]
```

### Commands

- `portpeek <port>`: Check if a port is in use (shows process name and PID).
- `portpeek <p1> <p2>`: Check multiple ports.
- `portpeek suggest <port> [count]`: Suggest `count` free ports starting from `port` (default: 4).
- `portpeek kill <port>`: Kill the process using the port (with confirmation).
- `portpeek info <port>`: Show detailed process info for the port.
- `portpeek --help`: Display help information.

### Options

- `--json`: Output results in JSON format.
- `--watch`: Watch port status every 3 seconds.
- `--log <file>`: Log output to a file.

## Examples

Check if port 8080 is in use:

```bash
portpeek 8080
```

Check multiple ports:

```bash
portpeek 8080 3000
```

Suggest 5 free ports starting from 8000:

```bash
portpeek suggest 8000 5
```

Kill the process using port 8080:

```bash
portpeek kill 8080
```

Show detailed info for port 8080:

```bash
portpeek info 8080
```

Output in JSON format:

```bash
portpeek 8080 --json
```

Watch port 8080 status:

```bash
portpeek 8080 --watch
```

Log output to a file:

```bash
portpeek 8080 --log output.log
```

## Troubleshooting

- **Permission issues**: On Linux/macOS, some ports may require `sudo` for `netstat` or `kill`. Run with elevated privileges if needed.
- **Windows `netstat` errors**: Ensure `netstat` is available in your PATH. It’s included in Windows by default.
- **Missing process info**: If `info` command fails, ensure the process is still running and you have permission to access it.

## Supported Platforms

- Windows (7, 10, 11)
- Linux (Ubuntu, CentOS, etc.)
- macOS (10.15 and later)

## License

MIT
