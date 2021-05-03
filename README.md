# Logging Helper Module

> Module to standardize logging output.

## Why?

> I don't like using `console.log` everywhere in my code. So this module allows me to standardize log statements with certain format.

## Notable Features

* Log levels
* Output by log levels
* Standardized log structure that includes (but not limited to) app name, module name, function name, and other information
* High-order functions to wrap module name and function name

## Log Entry

```json
/**
 * Log entry definition
 */
export interface LogEntry {
  logType: LOGTYPES;        // Log type
  appName: string;          // Application name
  modName: string;          // Module name
  fnName: string;           // Function name
  entryTS: Date;            // Log entry timestamp in UTC
  friendlyMsg: string;      // Log friendly/brief message
  detailMsg?: string;       // Log detail message (ex: StackTrace from Error)
  task?: string;            // Step/task being executed
  durationIsMS?: number;    // Duration taken in millisecond
}
```

## Loggers

### Main logger

> Logger that takes all parameters

### Module logger

> High-order logger on top of main logger to pin the module name

### Function logger

> High-order logger on top of module logger to ping the function name

## Log Output Override

This logger helper module does not actually output the log entries. It expects a logger output to be assigned via `setLoggerOutput()` function available from the main logger interface.

```json
/**
 * Delegate to output log entry
 */
export type LoggerOutput = (entry: Readonly<LogEntry> | Readonly<LogEntryWithDuration>) => void;
```

## Example

> To be added in the future

## Configure your application for ESM

> This module has been configured as ES module (ESM). You will need to run your application with `--es-module-specifier-resolution=node` option.
>
> Ex: `"exec": "node --es-module-specifier-resolution=node ./dist/index.js"` for your NPM script `npm run exec`.
>
> In addition, set the followings:

## package.json

> Set type to module

```json
{
  "name": "nodejs-prompt-example",
  "version": "1.0.0",
  "description": "Example for @simplyappdevs/nodejs-prompt NPM package",
  "main": "index.js",
  "type": "module",  // **Add this line**
  "scripts": {
  }
  ...
}
```

## tsconfig.json

> Set module to one of ECMA script

```json
{
  "compilerOptions": {
    ...
    "module": "esnext",                     /* Specify module code generation: 'none', 'commonjs', 'amd', 'system', 'umd', 'es2015', 'es2020', or 'ESNext'. */
    ...
  }
}
```

> Set module resolution to `node`

```json
{
  "compilerOptions": {
    ...
    "moduleResolution": "node",            /* Specify module resolution strategy: 'node' (Node.js) or 'classic' (TypeScript pre-1.6). */
    ...
  }
}
```

Brought to you by www.simplyappdevs.com (2021)
