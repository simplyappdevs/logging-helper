/**
 * Log types definition
 */
export enum LOGTYPES {
  Debug = 0,            // Debugging information (ex: Received acctID=1 roleID=2345)
  Informational = 1,    // Informational (ex: Application started up listening on port 25 on host localhost)
  Warning = 2,          // Warnings (ex: Configuration value for throwOnDefault is not set, defaulting to False)
  Error = 3,            // Error encountered but application may continue (ex: Unable to retrieve GIT users due to "Host cannot be resolved")
  CriticalError = 4     // Critical error encounter and application is terminated (ex: Application shutting down due to "Unable to bind to port 25")
}

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

/**
 * Log entry with duration definition
 */
export interface LogEntryWithDuration extends LogEntry {
  endTS: Date;              // Log entry end timestamp in UTC
}

/**
 * Delegate to output log entry
 */
export type LoggerOutput = (entry: LogEntry) => void;

/**
 * Logger definition
 */
export interface Logger {
  init: (appName: string) => Logger;                          // initialize logger
  appName: () => string;                                      // readonly application name
  setLoggerOutput: (fn: LoggerOutput | null) => Logger;       // override default logger output
  log: (logType: LOGTYPES, modName: string, fnName: string, msg: string | Error, detailMsg?: string, task?: string) => Logger;
  logDebug: (modName: string, fnName: string, msg: string | Error, detailMsg?: string, task?: string) => Logger;
  logInfo: (modName: string, fnName: string, msg: string | Error, detailMsg?: string, task?: string) => Logger;
  logWarning: (modName: string, fnName: string, msg: string | Error, detailMsg?: string, task?: string) => Logger;
  logError: (modName: string, fnName: string, msg: string | Error, detailMsg?: string, task?: string) => Logger;
  logCriticalError: (modName: string, fnName: string, msg: string | Error, detailMsg?: string, task?: string) => Logger;
  getLoggerForModule: (modName: string) => LoggerForModule | undefined;
  getLoggerForFn: (modName: string, fnName: string) => LoggerForFn | undefined;
  createModuleLogger: (modName: string) => LoggerForModule;
  createFnLogger: (modName: string, fnName: string) => LoggerForFn;
}

/**
 * Logger object for module name HOC
 */
export interface LoggerForModule {
  readonly logger: Logger;
  readonly moduleName: string;
  log: (logType: LOGTYPES, fnName: string, msg: string | Error, detailMsg?: string, task?: string) => LoggerForModule;
  logDebug: (fnName: string, msg: string | Error, detailMsg?: string, task?: string) => LoggerForModule;
  logInfo: (fnName: string, msg: string | Error, detailMsg?: string, task?: string) => LoggerForModule;
  logWarning: (fnName: string, msg: string | Error, detailMsg?: string, task?: string) => LoggerForModule;
  logError: (fnName: string, msg: string | Error, detailMsg?: string, task?: string) => LoggerForModule;
  logCriticalError: (fnName: string, msg: string | Error, detailMsg?: string, task?: string) => LoggerForModule;
  getLoggerForFn: (fnName: string) => LoggerForFn | undefined;
  createFnLogger: (fnName: string) => LoggerForFn;
}

/**
 * Logger object for function name HOC
 */
export interface LoggerForFn {
  readonly logger: Logger;
  readonly moduleLogger: LoggerForModule;
  readonly fnName: string;
  log: (logType: LOGTYPES, msg: string | Error, detailMsg?: string, task?: string) => LoggerForFn;
  logDebug: (msg: string | Error, detailMsg?: string, task?: string) => LoggerForFn;
  logInfo: (msg: string | Error, detailMsg?: string, task?: string) => LoggerForFn;
  logWarning: (msg: string | Error, detailMsg?: string, task?: string) => LoggerForFn;
  logError: (msg: string | Error, detailMsg?: string, task?: string) => LoggerForFn;
  logCriticalError: (msg: string | Error, detailMsg?: string, task?: string) => LoggerForFn;
}

/**
 * Interface for log wrappers collection
 */
export interface LoggerCollection<T extends LoggerForModule | LoggerForFn> {
  readonly coll: Map<string, T>;
  buildCollKey: (modName: string, fnName?: string) => string;
  createLogger: (modName: string, fnName?: string) => T;
  getLogger: (modName: string, fnName?: string) => T | undefined;
}
