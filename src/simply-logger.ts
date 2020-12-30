/**
 * 3rd Party helper imports
 */
import bon from './browser-or-node-helper';

/**
 * App imports
 */
import {LogEntry, LogEntryWithDuration, Logger, LoggerOutput, LOGTYPES} from './typedefs';

/**
 * Internal logging information definition
 */
interface LoggingInformation {
  appName: string;            // Application name (should be set one time during application bootstrap)
  getAppName: () => string;   // Get current app name
  modNames: string[];         // Module names (should be set one-time during module init)
}

/**
 * Internal logging information
 */
const loggerInfo: LoggingInformation = {
  appName: '',
  getAppName: () => {
    return loggerInfo.appName;
  },
  modNames: [],
};

/**
 * Default log entry information
 */
const defLogEntryInfo = {
  appName: bon.isNode() ? 'node-app' : bon.isBrowser() ? 'browser-app' : bon.isJsDom() ? 'jsdom-app' : 'unknown-app',
  modName: 'simply-logger'
};

/**
 * Returns whether logger is active or not
 */
const canLog: () => boolean = () => {
  return (loggerInfo.appName !== '');
};

/**
 * Default logger (console.log)
 * @param entry Log entry to output
 */
const defLogger: LoggerOutput = (entry: LogEntry): void => {
  // timestamp: [type]:[module]:[fn] (task) msg
  console.log(`${entry.entryTS.toISOString()}: [${entry.logType.toString()}]:[${entry.modName || '-'}]:[${entry.fnName || '-'}] (${entry.task || '-'}) ${entry.friendlyMsg}`);
};

// function pointer to the output function
let loggerOutput: LoggerOutput = defLogger;

/**
 * Initialize module
 * @param appName Application name
 */
const modInit = (appName: string): void => {
  // clean up
  appName = appName.trim().toUpperCase();

  if (loggerInfo.appName !== '') {
    // internal log entry
    const entry = createInternalLogEntry(LOGTYPES.Warning, 'modInit()', `Logger has been initialized with \'${loggerInfo.appName}\' and being called again with \'${appName}\'`, undefined, 'SIMPLY-LOGGER-INIT');
    loggerOutput(entry);
  } else {
    // set it
    loggerInfo.appName = appName;
  }
};

/**
 * Appends end timestamp to a log entry
 * @param logEntry Log entry without timestamp
 * @param endTS End timestamp for the log entry
 */
const createLogEntryWithDuration = (logEntry: LogEntry, endTS: Date): LogEntryWithDuration => {
  return {...logEntry, endTS: endTS};
};

/**
 * Creates log entry
 * @param logType Log type
 * @param modName Module name
 * @param fnName Function name
 * @param msg Friendly message or Error object
 * @param detailMsg Detail message (optional). Auto-populated with msg.stack if msg is Error
 * @param task Task name (optional)
 */
const createLogEntry = (logType: LOGTYPES, modName: string, fnName: string, msg: string | Error, detailMsg?: string, task?: string): LogEntry => {
  return {
    logType: logType,
    appName: loggerInfo.getAppName(),
    modName: modName,
    fnName: fnName,
    entryTS: new Date(),
    friendlyMsg: msg instanceof Error ? msg.message : msg,
    detailMsg: detailMsg ? detailMsg : msg instanceof Error ? msg.stack! : '',
    durationIsMS: undefined,
    task: task
  };
};

/**
 * Create internal log entry (used by logger itself)
 * @param logType Log type
 * @param fnName Function name
 * @param msg Friendly message or Error object
 * @param detailMsg Detail message (optional). Auto-populated with msg.stack if msg is Error
 * @param task Task name (optional)
 */
const createInternalLogEntry = (logType: LOGTYPES, fnName: string, msg: string | Error, detailMsg?: string, task?: string): LogEntry => {
  const logEntry = createLogEntry(logType, defLogEntryInfo.modName, fnName, msg, detailMsg, task);
  logEntry.appName = defLogEntryInfo.appName;

  return logEntry;
};

/**
 * Log an entry
 * @param logType Log type
 * @param modName Module name
 * @param fnName Function name
 * @param msg Friendly message or Error object
 * @param detailMsg Detail message (optional). Auto-populated with msg.stack if msg is Error
 * @param task Task name (optional)
 */
const log = (logType: LOGTYPES, modName: string, fnName: string, msg: string | Error, detailMsg?: string, task?: string): void => {
  // validate if we can log
  if (!canLog()) {
    throw new Error('simply-logger-error: Logger has not been initialized');
  }

  const logEntry: LogEntry = createLogEntry(logType, modName, fnName, msg, detailMsg, task);
  loggerOutput(logEntry);
};

/**
 * Log a debug entry
 * @param modName Module name
 * @param fnName Function name
 * @param msg Friendly message or Error object
 * @param detailMsg Detail message (optional). Auto-populated with msg.stack if msg is Error
 * @param task Task name (optional)
 */
const logDebug = (modName: string, fnName: string, msg: string | Error, detailMsg?: string, task?: string): void => {
  log(LOGTYPES.Debug, modName, fnName, msg, detailMsg, task);
};

/**
 * Log an informational entry
 * @param modName Module name
 * @param fnName Function name
 * @param msg Friendly message or Error object
 * @param detailMsg Detail message (optional). Auto-populated with msg.stack if msg is Error
 * @param task Task name (optional)
 */
const logInfo = (modName: string, fnName: string, msg: string | Error, detailMsg?: string, task?: string): void => {
  log(LOGTYPES.Informational, modName, fnName, msg, detailMsg, task);
};

/**
 * Log a warning entry
 * @param modName Module name
 * @param fnName Function name
 * @param msg Friendly message or Error object
 * @param detailMsg Detail message (optional). Auto-populated with msg.stack if msg is Error
 * @param task Task name (optional)
 */
const logWarning = (modName: string, fnName: string, msg: string | Error, detailMsg?: string, task?: string): void => {
  log(LOGTYPES.Warning, modName, fnName, msg, detailMsg, task);
};

/**
 * Log an error entry
 * @param modName Module name
 * @param fnName Function name
 * @param msg Friendly message or Error object
 * @param detailMsg Detail message (optional). Auto-populated with msg.stack if msg is Error
 * @param task Task name (optional)
 */
const logError = (modName: string, fnName: string, msg: string | Error, detailMsg?: string, task?: string): void => {
  log(LOGTYPES.Error, modName, fnName, msg, detailMsg, task);
};

/**
 * Log a critical error entry
 * @param modName Module name
 * @param fnName Function name
 * @param msg Friendly message or Error object
 * @param detailMsg Detail message (optional). Auto-populated with msg.stack if msg is Error
 * @param task Task name (optional)
 */
const logCriticalError = (modName: string, fnName: string, msg: string | Error, detailMsg?: string, task?: string): void => {
  log(LOGTYPES.CriticalError, modName, fnName, msg, detailMsg, task);
};

/**
 * Logger module
 */
const logger: Logger = {
  init: modInit,
  appName: loggerInfo.getAppName,
  log: log,
  logDebug: logDebug,
  logInfo: logInfo,
  logWarning: logWarning,
  logError: logError,
  logCriticalError: logCriticalError,
  setLoggerOutput: (fn: LoggerOutput | null) => {
    loggerOutput = fn || defLogger;
  }
};

// Export
export default logger;