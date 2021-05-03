/**
 * Log types definition (BITWISE)
 */
export enum LOGTYPES {
  Debug = 0,                 // Debugging information (ex: Received acctID=1 roleID=2345)
  Informational = 1 << 0,    // Informational (ex: Application started up listening on port 25 on host localhost)
  Warning = 1 << 1,          // Warnings (ex: Configuration value for throwOnDefault is not set, defaulting to False)
  Error = 1 << 2,            // Error encountered but application may continue (ex: Unable to retrieve GIT users due to "Host cannot be resolved")
  CriticalError = 1 << 3     // Critical error encounter and application is terminated (ex: Application shutting down due to "Unable to bind to port 25")
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
  readonly init: (appName: string) => Logger;                                               // initialize logger
  appName: () => string;                                                                    // readonly application name
  readonly setLoggerOutput: (fn: LoggerOutput | null) => Logger;                            // override default logger output
  readonly log: (logType: LOGTYPES, modName: string, fnName: string, msg: string | Error, detailMsg?: string, task?: string) => Logger; // main log function that takes all parameters
  readonly logDebug: (modName: string, fnName: string, msg: string | Error, detailMsg?: string, task?: string) => Logger;               // log debug statements
  readonly logInfo: (modName: string, fnName: string, msg: string | Error, detailMsg?: string, task?: string) => Logger;                // log information statements
  readonly logWarning: (modName: string, fnName: string, msg: string | Error, detailMsg?: string, task?: string) => Logger;             // log warning statements
  readonly logError: (modName: string, fnName: string, msg: string | Error, detailMsg?: string, task?: string) => Logger;               // log error statements
  readonly logCriticalError: (modName: string, fnName: string, msg: string | Error, detailMsg?: string, task?: string) => Logger;       // log critical error statements
  readonly getLoggerForModule: (modName: string) => LoggerForModule | undefined;            // get existing logger for a module
  readonly getLoggerForFn: (modName: string, fnName: string) => LoggerForFn | undefined;    // get existing logger for a function in a module
  readonly createModuleLogger: (modName: string) => LoggerForModule;                        // create a logger for a module
  readonly createFnLogger: (modName: string, fnName: string) => LoggerForFn;                // create a logger for a function in a module
  readonly createLogEntry: (logType: LOGTYPES, modName: string, fnName: string, msg: string | Error, detailMsg?: string, task?: string) => Readonly<LogEntry>;  // create a log entry
  readonly logWithDuration: (logEntry: LogEntry) => Logger;                                 // log an entry with duration value
}

/**
 * Logger object for module HOC
 */
export interface LoggerForModule {
  readonly logger: Logger;                                                // main logger object
  readonly moduleName: string;                                            // module name
  readonly log: (logType: LOGTYPES, fnName: string, msg: string | Error, detailMsg?: string, task?: string) => LoggerForModule;     // main log function that takes all parameters
  readonly logDebug: (fnName: string, msg: string | Error, detailMsg?: string, task?: string) => LoggerForModule;                   // log debug statements
  readonly logInfo: (fnName: string, msg: string | Error, detailMsg?: string, task?: string) => LoggerForModule;                    // log information statements
  readonly logWarning: (fnName: string, msg: string | Error, detailMsg?: string, task?: string) => LoggerForModule;                 // log warning statements
  readonly logError: (fnName: string, msg: string | Error, detailMsg?: string, task?: string) => LoggerForModule;                   // log error statements
  readonly logCriticalError: (fnName: string, msg: string | Error, detailMsg?: string, task?: string) => LoggerForModule;           // log critical error statements
  readonly getLoggerForFn: (fnName: string) => LoggerForFn | undefined;   // get logger for a function in this module
  readonly createFnLogger: (fnName: string) => LoggerForFn;               // create logger for a function in this module
  readonly logWithDuration: (logEntry: LogEntry) => LoggerForModule;      // log an entry with duration value
}

/**
 * Logger object for function name HOC
 */
export interface LoggerForFn {
  readonly logger: Logger;                                                // main logger object
  readonly moduleLogger: LoggerForModule;                                 // module logger object
  readonly fnName: string;                                                // function name
  readonly log: (logType: LOGTYPES, msg: string | Error, detailMsg?: string, task?: string) => LoggerForFn;     // main log function that takes all parameters
  readonly logDebug: (msg: string | Error, detailMsg?: string, task?: string) => LoggerForFn;                   // log debug statements
  readonly logInfo: (msg: string | Error, detailMsg?: string, task?: string) => LoggerForFn;                    // log information statements
  readonly logWarning: (msg: string | Error, detailMsg?: string, task?: string) => LoggerForFn;                 // log warning statements
  readonly logError: (msg: string | Error, detailMsg?: string, task?: string) => LoggerForFn;                   // log error statements
  readonly logCriticalError: (msg: string | Error, detailMsg?: string, task?: string) => LoggerForFn;           // log critical error statements
  readonly logWithDuration: (logEntry: LogEntry) => LoggerForFn;          // log an entry with duration value
}

/**
 * Interface for log wrappers collection
 */
export interface LoggerCollection<T extends LoggerForModule | LoggerForFn> {
  readonly coll: Map<string, T>;                                                                  // collection of loggers
  buildCollKey: (this: LoggerCollection<T>, modName: string, fnName?: string) => string;          // build key for a module or a function in a module
  createLogger: (this: LoggerCollection<T>, modName: string, fnName?: string) => T;               // create logger for a module or a function in a module
  getLogger: (this: LoggerCollection<T>, modName: string, fnName?: string) => T | undefined;      // get logger for a module or function in a module
}

/**
 * Interface for log helper configurations
 */
export interface LogHelperConfiguration {
  enabled: boolean;
  logLevels: LOGTYPES;
  useColors: boolean;
}
