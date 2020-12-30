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
  init: (appName: string) => void;      // initialize logger
  appName: () => string;                // readonly application name
  log: (logType: LOGTYPES, modName: string, fnName: string, msg: string | Error, detailMsg?: string, task?: string) => void;
  logDebug: (modName: string, fnName: string, msg: string | Error, detailMsg?: string, task?: string) => void;
  logInfo: (modName: string, fnName: string, msg: string | Error, detailMsg?: string, task?: string) => void;
  logWarning: (modName: string, fnName: string, msg: string | Error, detailMsg?: string, task?: string) => void;
  logError: (modName: string, fnName: string, msg: string | Error, detailMsg?: string, task?: string) => void;
  logCriticalError: (modName: string, fnName: string, msg: string | Error, detailMsg?: string, task?: string) => void;
  setLoggerOutput: (fn: LoggerOutput | null) => void;
}