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
  endTS: Date;             // Log entry end timestamp in UTC
  durationInMS: number;    // function to calculate duration in millisecond
}

/**
 * Delegate to output log entry
 */
export type LoggerOutput = (entry: Readonly<LogEntry> | Readonly<LogEntryWithDuration>) => void;

/**
 * Logger definition
 */
export interface Logger {
  readonly init: (appName: string) => Logger;                          // initialize logger
  appName: () => string;                                      // readonly application name
  readonly setLoggerOutput: (fn: LoggerOutput | null) => Logger;       // override default logger output
  readonly log: (logType: LOGTYPES, modName: string, fnName: string, msg: string | Error, detailMsg?: string, task?: string) => Logger;
  readonly logDebug: (modName: string, fnName: string, msg: string | Error, detailMsg?: string, task?: string) => Logger;
  readonly logInfo: (modName: string, fnName: string, msg: string | Error, detailMsg?: string, task?: string) => Logger;
  readonly logWarning: (modName: string, fnName: string, msg: string | Error, detailMsg?: string, task?: string) => Logger;
  readonly logError: (modName: string, fnName: string, msg: string | Error, detailMsg?: string, task?: string) => Logger;
  readonly logCriticalError: (modName: string, fnName: string, msg: string | Error, detailMsg?: string, task?: string) => Logger;
  readonly getLoggerForModule: (modName: string) => LoggerForModule | undefined;
  readonly getLoggerForFn: (modName: string, fnName: string) => LoggerForFn | undefined;
  readonly createModuleLogger: (modName: string) => LoggerForModule;
  readonly createFnLogger: (modName: string, fnName: string) => LoggerForFn;
  readonly createLogEntry: (logType: LOGTYPES, modName: string, fnName: string, msg: string | Error, detailMsg?: string, task?: string) => Readonly<LogEntry>;
  readonly logWithDuration: (logEntry: LogEntry) => Logger;
}

/**
 * Logger object for module name HOC
 */
export interface LoggerForModule {
  readonly logger: Logger;
  readonly moduleName: string;
  readonly log: (logType: LOGTYPES, fnName: string, msg: string | Error, detailMsg?: string, task?: string) => LoggerForModule;
  readonly logDebug: (fnName: string, msg: string | Error, detailMsg?: string, task?: string) => LoggerForModule;
  readonly logInfo: (fnName: string, msg: string | Error, detailMsg?: string, task?: string) => LoggerForModule;
  readonly logWarning: (fnName: string, msg: string | Error, detailMsg?: string, task?: string) => LoggerForModule;
  readonly logError: (fnName: string, msg: string | Error, detailMsg?: string, task?: string) => LoggerForModule;
  readonly logCriticalError: (fnName: string, msg: string | Error, detailMsg?: string, task?: string) => LoggerForModule;
  readonly getLoggerForFn: (fnName: string) => LoggerForFn | undefined;
  readonly createFnLogger: (fnName: string) => LoggerForFn;
  readonly logWithDuration: (logEntry: LogEntry) => LoggerForModule;
}

/**
 * Logger object for function name HOC
 */
export interface LoggerForFn {
  readonly logger: Logger;
  readonly moduleLogger: LoggerForModule;
  readonly fnName: string;
  readonly log: (logType: LOGTYPES, msg: string | Error, detailMsg?: string, task?: string) => LoggerForFn;
  readonly logDebug: (msg: string | Error, detailMsg?: string, task?: string) => LoggerForFn;
  readonly logInfo: (msg: string | Error, detailMsg?: string, task?: string) => LoggerForFn;
  readonly logWarning: (msg: string | Error, detailMsg?: string, task?: string) => LoggerForFn;
  readonly logError: (msg: string | Error, detailMsg?: string, task?: string) => LoggerForFn;
  readonly logCriticalError: (msg: string | Error, detailMsg?: string, task?: string) => LoggerForFn;
  readonly logWithDuration: (logEntry: LogEntry) => LoggerForFn;
}

/**
 * Interface for log wrappers collection
 */
export interface LoggerCollection<T extends LoggerForModule | LoggerForFn> {
  readonly coll: Map<string, T>;
  buildCollKey: (this: LoggerCollection<T>, modName: string, fnName?: string) => string;
  createLogger: (this: LoggerCollection<T>, modName: string, fnName?: string) => T;
  getLogger: (this: LoggerCollection<T>, modName: string, fnName?: string) => T | undefined;
}
