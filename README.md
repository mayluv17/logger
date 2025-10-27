# Logger

A Node.js logging utility built with Winston that provides structured logging with multiple transport options including console output and file logging.

## Features

- 📝 **Structured Logging**: JSON-formatted logs with timestamps
- 📊 **Multiple Transports**: Console, error log file, and combined log file
- 🎯 **Log Levels**: Supports info, warn, error, and debug levels
- 🧪 **Tested**: Comprehensive test suite using Mocha and Chai

## Installation

```bash
npm install
```

## Dependencies

- **winston** (^3.11.0): Multi-transport logging library for Node.js

## Usage

### Basic Usage

```javascript
const logger = require('./src/logger');

// Log an informational message
logger.info('This is an informational message.');

// Log a warning
logger.warn('This is a warning message.');

// Log an error
logger.error('This is an error message.');

// Log with explicit level
logger.log('info', 'Another informational message.');
```

### Available Methods

- `logger.info(message)` - Log informational messages
- `logger.warn(message)` - Log warning messages
- `logger.error(message)` - Log error messages
- `logger.debug(message)` - Log debug messages
- `logger.log(level, message)` - Generic logging method

### Log Outputs

The logger is configured to output logs to multiple destinations:

1. **Console** - Logs appear in the terminal for immediate visibility
2. **Error Log** (`logs/error.log`) - Only error-level messages
3. **Combined Log** (`logs/combined.log`) - All log messages across all levels

### Example Output

```json
{"level":"info","message":"This is an informational message.","timestamp":"2024-01-15T10:30:00.000Z"}
{"level":"warn","message":"This is a warning message.","timestamp":"2024-01-15T10:30:01.000Z"}
{"level":"error","message":"This is an error message.","timestamp":"2024-01-15T10:30:02.000Z"}
```

## Configuration

The logger is configured with the following settings:

- **Log Level**: `info` (shows info, warn, and error messages)
- **Format**: JSON with timestamp
- **Transports**:
  - Console
  - Error log file (`logs/error.log`)
  - Combined log file (`logs/combined.log`)

To modify the configuration, edit `src/logger.js`:

```javascript
const logger = createLogger({
  level: 'info', // Change log level (e.g., 'debug', 'warn', 'error')
  format: format.combine(format.timestamp(), format.json()),
  transports: [
    new transports.Console(),
    new transports.File({ filename: 'logs/error.log', level: 'error' }),
    new transports.File({ filename: 'logs/combined.log' }),
  ],
});
```

## Running the Example

To see the logger in action, run the example file:

```bash
node src/main.js
```

This will output logs to the console and create log files in the `logs/` directory.

## Testing

The project includes a comprehensive test suite using Mocha and Chai.

### Run Tests

```bash
npm test
```

### Test Coverage

The test suite includes:

- ✅ Logger initialization and configuration
- ✅ Available logging methods
- ✅ File creation and logging
- ✅ JSON format validation
- ✅ Timestamp inclusion
- ✅ Log level filtering
- ✅ Error log isolation

## Project Structure

```
logger/
├── src/
│   ├── logger.js      # Logger configuration and exports
│   └── main.js        # Example usage
├── test/
│   └── logger.test.js # Test suite
├── logs/
│   ├── error.log      # Error-level logs only
│   └── combined.log   # All logs
├── package.json
└── README.md
```

## Log Levels

Winston supports the following log levels (from lowest to highest priority):

- `error` - Error events
- `warn` - Warning events
- `info` - Informational messages
- `verbose` - Verbose messages
- `debug` - Debug messages
- `silly` - Silly messages

Only messages at the configured level and above will be logged.

## Contributing

Feel free to submit issues and enhancement requests!

## License

ISC
