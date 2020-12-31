/**
 * 3rd Party helper imports
 */
import bon from './browser-or-node-helper';

/**
 * App imports
 */
import {LogEntry, LogEntryWithDuration, Logger, LoggerCollection, LoggerForFn, LoggerForModule, LoggerOutput, LOGTYPES} from './typedefs';

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
 * Returns whether module can log or not based on internal state of this module
 */
const isLoggable = (): boolean => {
  return (loggerInfo.appName !== '');
};

/**
 * Throws an error if module is not ready for logging
 */
const canLog: () => void = () => {
  if (!isLoggable()) {
    throw new Error(createMessage('Logger has not been initialized'));
  }
};

/**
 * Default logger (console.log)
 * @param entry Log entry to output
 */
const defLogger: LoggerOutput = (entry: LogEntry): void => {
  // timestamp: [type]:[module]:[fn] (task) msg
  console.log(`${entry.entryTS.toISOString()}: [${entry.logType.toString()}]:[${entry.modName || '-'}]:[${entry.fnName || '-'}] (${entry.task || '-'}) ${entry.friendlyMsg}`);
};

/**
 * Returns standardized message
 * @param msg  message
 */
const createMessage = (msg: string): string => {
  return `simply-logger-helper: ${msg}`;
};

/**
 * Returns the duration in milliseconds
 * @param startTS Start timestamp
 * @param endTS End timestamp
 */
const calcDurationInMS = (startTS: Date, endTS: Date): number => {
  return endTS.getTime() - startTS.getTime();
};

// function pointer to the output function
let loggerOutput: LoggerOutput = defLogger;

/**
 * Initialize module
 * @param appName Application name
 */
const modInit = (appName: string): Logger => {
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

  return logger;
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
 * Appends end timestamp to a log entry
 * @param logEntry Log entry without timestamp
 * @param endTS End timestamp for the log entry
 */
const createLogEntryWithDuration = (logEntry: LogEntry, endTS: Date): LogEntryWithDuration => {
  return {
    ...logEntry,
    endTS: endTS,
    durationInMS: calcDurationInMS(logEntry.entryTS, endTS)
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
const log = (logType: LOGTYPES, modName: string, fnName: string, msg: string | Error, detailMsg?: string, task?: string): Logger => {
  // validate if we can log
  canLog();

  // create entry and output it
  const logEntry: LogEntry = createLogEntry(logType, modName, fnName, msg, detailMsg, task);
  loggerOutput(logEntry);

  return logger;
};

/**
 * Log a debug entry
 * @param modName Module name
 * @param fnName Function name
 * @param msg Friendly message or Error object
 * @param detailMsg Detail message (optional). Auto-populated with msg.stack if msg is Error
 * @param task Task name (optional)
 */
const logDebug = (modName: string, fnName: string, msg: string | Error, detailMsg?: string, task?: string): Logger => {
  log(LOGTYPES.Debug, modName, fnName, msg, detailMsg, task);

  return logger;
};

/**
 * Log an informational entry
 * @param modName Module name
 * @param fnName Function name
 * @param msg Friendly message or Error object
 * @param detailMsg Detail message (optional). Auto-populated with msg.stack if msg is Error
 * @param task Task name (optional)
 */
const logInfo = (modName: string, fnName: string, msg: string | Error, detailMsg?: string, task?: string): Logger => {
  log(LOGTYPES.Informational, modName, fnName, msg, detailMsg, task);

  return logger;
};

/**
 * Log a warning entry
 * @param modName Module name
 * @param fnName Function name
 * @param msg Friendly message or Error object
 * @param detailMsg Detail message (optional). Auto-populated with msg.stack if msg is Error
 * @param task Task name (optional)
 */
const logWarning = (modName: string, fnName: string, msg: string | Error, detailMsg?: string, task?: string): Logger => {
  log(LOGTYPES.Warning, modName, fnName, msg, detailMsg, task);

  return logger;
};

/**
 * Log an error entry
 * @param modName Module name
 * @param fnName Function name
 * @param msg Friendly message or Error object
 * @param detailMsg Detail message (optional). Auto-populated with msg.stack if msg is Error
 * @param task Task name (optional)
 */
const logError = (modName: string, fnName: string, msg: string | Error, detailMsg?: string, task?: string): Logger => {
  log(LOGTYPES.Error, modName, fnName, msg, detailMsg, task);

  return logger;
};

/**
 * Log a critical error entry
 * @param modName Module name
 * @param fnName Function name
 * @param msg Friendly message or Error object
 * @param detailMsg Detail message (optional). Auto-populated with msg.stack if msg is Error
 * @param task Task name (optional)
 */
const logCriticalError = (modName: string, fnName: string, msg: string | Error, detailMsg?: string, task?: string): Logger => {
  log(LOGTYPES.CriticalError, modName, fnName, msg, detailMsg, task);

  return logger;
};

// collection of module level loggers
const modWrappers: LoggerCollection<LoggerForModule> = {
  coll: new Map(),
  buildCollKey: function (modName: string, fnName?: string) {
    // validate
    modName = modName.trim();
    fnName = fnName || '';      // we are ignoring this parameter

    if (modName === '') {
      throw new Error(createMessage('Missing module name'));
    }

    return `MOD[${modName.toUpperCase()}]`;
  },
  createLogger: function(modName: string, fnName?: string) {
    // get existing
    const collKey = this.buildCollKey(modName, fnName);

    let modLogger = this.coll.get(collKey);

    if (!modLogger) {
      // create new
      modLogger = {
        logger: logger,
        moduleName: modName,
        log: (logType: LOGTYPES, fnName: string, msg: string | Error, detailMsg?: string, task?: string) => {
          logger.log(logType, modLogger!.moduleName, fnName, msg, detailMsg, task);

          return modLogger!;
        },
        logDebug: (fnName: string, msg: string | Error, detailMsg?: string, task?: string) => {
          logger.logDebug(modLogger!.moduleName, fnName, msg, detailMsg, task);

          return modLogger!;
        },
        logInfo: (fnName: string, msg: string | Error, detailMsg?: string, task?: string) => {
          logger.logInfo(modLogger!.moduleName, fnName, msg, detailMsg, task);

          return modLogger!;
        },
        logWarning: (fnName: string, msg: string | Error, detailMsg?: string, task?: string) => {
          logger.logWarning(modLogger!.moduleName, fnName, msg, detailMsg, task);

          return modLogger!;
        },
        logError: (fnName: string, msg: string | Error, detailMsg?: string, task?: string) => {
          logger.logError(modLogger!.moduleName, fnName, msg, detailMsg, task);

          return modLogger!;
        },
        logCriticalError: (fnName: string, msg: string | Error, detailMsg?: string, task?: string) => {
          logger.logCriticalError(modLogger!.moduleName, fnName, msg, detailMsg, task);

          return modLogger!;
        },
        getLoggerForFn: (fnName: string) => {
          return fnWrappers.getLogger(modLogger!.moduleName, fnName);
        },
        createFnLogger: (fnName: string) => {
          return fnWrappers.createLogger(modLogger!.moduleName, fnName);
        },
        logWithDuration: (logEntry: LogEntry) => {
          logger.logWithDuration(logEntry);

          return modLogger!;
        }
      };

      // add to collection
      this.coll.set(collKey, modLogger!);
    }

    return modLogger!;
  },
  getLogger: function(modName: string, fnName?: string) {
    // build key
    return this.coll.get(this.buildCollKey(modName, fnName));
  }
};

// collections of function wrappers
const fnWrappers: LoggerCollection<LoggerForFn> = {
  coll: new Map(),
  buildCollKey: function(modName: string, fnName?: string) {
    // validate
    fnName = (fnName || '').trim();

    if (fnName === '') {
      throw new Error(createMessage('Missing function name'));
    }

    // build key
    return `${modWrappers.buildCollKey(modName)}|FN[${fnName.toUpperCase()}]`;
  },
  createLogger: function(modName: string, fnName?: string) {
    // get module logger
    const modLogger = modWrappers.getLogger(modName, fnName);

    if (!modLogger) {
      throw new Error(createMessage(`No logger exist for module ${modName}`));
    }

    // build key
    const collKey = this.buildCollKey(modName, fnName);

    // get existing
    let fnLogger = this.coll.get(collKey);

    if (!fnLogger) {
      fnLogger = {
        logger: logger,
        moduleLogger: modLogger!,
        fnName: fnName!.trim(),
        log: (logType: LOGTYPES,  msg: string | Error, detailMsg?: string, task?: string) => {
          logger.log(logType, modName, fnLogger!.fnName, msg, detailMsg, task);

          return fnLogger!;
        },
        logDebug: (msg: string | Error, detailMsg?: string, task?: string) => {
          logger.logDebug(modName, fnLogger!.fnName, msg, detailMsg, task);

          return fnLogger!;
        },
        logInfo: (msg: string | Error, detailMsg?: string, task?: string) => {
          logger.logInfo(modName, fnLogger!.fnName, msg, detailMsg, task);

          return fnLogger!;
        },
        logWarning: (msg: string | Error, detailMsg?: string, task?: string) => {
          logger.logWarning(modName, fnLogger!.fnName, msg, detailMsg, task);

          return fnLogger!;
        },
        logError: (msg: string | Error, detailMsg?: string, task?: string) => {
          logger.logError(modName, fnLogger!.fnName, msg, detailMsg, task);

          return fnLogger!;
        },
        logCriticalError: (msg: string | Error, detailMsg?: string, task?: string) => {
          logger.logCriticalError(modName, fnLogger!.fnName, msg, detailMsg, task);

          return fnLogger!;
        },
        logWithDuration: (logEntry: LogEntry) => {
          logger.logWithDuration(logEntry);

          return fnLogger!;
        }
      };

      this.coll.set(collKey, fnLogger!);
    }

    return fnLogger!;
  },
  getLogger: function(modName: string, fnName?: string) {
    return this.coll.get(this.buildCollKey(modName, fnName));
  }
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

    return logger;
  },
  getLoggerForModule: (modName: string) => {
    return modWrappers.getLogger(modName);
  },
  getLoggerForFn: (modName: string, fnName: string) => {
    return fnWrappers.getLogger(modName, fnName);
  },
  createModuleLogger: (modName: string) => {
    return modWrappers.createLogger(modName);
  },
  createFnLogger: (modName: string, fnName: string) => {
    return fnWrappers.createLogger(modName, fnName);
  },
  createLogEntry: (logType: LOGTYPES, modName: string, fnName: string, msg: string | Error, detailMsg?: string, task?: string) => {
    canLog();

    return createLogEntry(logType, modName, fnName, msg, detailMsg, task);
  },
  logWithDuration: (logEntry: LogEntry) => {
    canLog();

    // convert to logentry with duration
    const logEntryDur = createLogEntryWithDuration(logEntry, new Date());
    loggerOutput(logEntryDur);

    return logger;
  }
};

// Export
export default logger;