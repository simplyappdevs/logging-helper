/**
 * Mocks
 */
import {BonMockInterface} from '../src/__mocks__/browser-or-node-helper';

 /**
 * App imports
 */
import {LogEntry, Logger, LoggerOutput, LOGTYPES} from '../src';

let logger: Logger;

/**
 * Output logger mock
 * @param entry Log entry
 */
const mockLoggerOutput: LoggerOutput = (entry: LogEntry) => {
  console.info(`Mock Logger:\n${JSON.stringify(entry, null, 2)}`);
};

// mock objects
const mocks = {
  loggerOutput: mockLoggerOutput
};

/**
 * Unit test for logger
 */
describe('Logger', () => {
  /**
   * Unit tests for logging helper object
   */
  describe('Logging Functions', () => {
    // app name
    const appName: string = 'LoggerTest';
    const appName2: string = 'LoggerTest2';
    const appName3: string = 'LoggerTest3';

    // spies
    let consoleLogSpy: jest.SpyInstance;
    let mockLoggerSpy: jest.SpyInstance;

    beforeAll(() => {
      // spy on console
      consoleLogSpy = jest.spyOn(console, 'log');
      mockLoggerSpy = jest.spyOn(mocks, 'loggerOutput');
    });

    beforeEach(() => {
      // reimport logger between tests
      import('../src/simply-logger').then((val) => {
        logger = val.default;

        jest.resetModules();
      });
    });

    afterEach(() => {
      // clear mocks/spies between test
      jest.clearAllMocks();
    });

    /**
     * Initialization tests
     */
    describe('initializations', () => {
      /**
       * Initialize logger and appName should be what was set
       */
      test('should initialize', () => {
        logger.init(appName);
        expect(logger.appName()).toEqual(appName.toUpperCase());
      });

      /**
       * Logger must be initialized before it can be used (appName must be set)
       */
      test('should not allow usage before initialize', () => {
        // app name should not be set yet
        expect(logger.appName()).toEqual('');

        // expect logging function to throw error
        expect(() => {
          logger.log(LOGTYPES.Informational, 'unittest', 'test()', 'This should not be logged');
        }).toThrow('simply-logger-error: Logger has not been initialized');
      });

      /**
       * Logger logs warning if init() is called multiple times (note also that this tests the internal output logger which is just console.log)
       */
      test('should log warning if initialized multiple times', () => {
        // sets it first time
        logger.init(appName);
        expect(logger.appName()).toEqual(appName.toUpperCase());
        expect(consoleLogSpy).not.toHaveBeenCalled();

        // sets the second time (appName should not have been modified)
        logger.init(appName2);
        expect(logger.appName()).toEqual(appName.toUpperCase());
        expect(consoleLogSpy).toHaveBeenCalledTimes(1);

        // sets the third time (appName should not have been modified)
        logger.init(appName3);
        expect(logger.appName()).toEqual(appName.toUpperCase());
        expect(consoleLogSpy).toHaveBeenCalledTimes(2);
      });
    });

    /**
     * Logger output function tests
     */
    describe('logger output function', () => {
      test('using internal default logger', () => {
        logger.init(appName);

        logger.log(LOGTYPES.Informational, 'unittest', 'test()', 'Logging to default logger');
        expect(consoleLogSpy).toHaveBeenCalledTimes(1);
        expect(mockLoggerSpy).toHaveBeenCalledTimes(0);
      });

      test('using mock logger', () => {
        logger.init(appName);
        logger.setLoggerOutput(mocks.loggerOutput);

        logger.log(LOGTYPES.Informational, 'unittest', 'test()', 'Logging to mock logger');
        expect(consoleLogSpy).toHaveBeenCalledTimes(0);
        expect(mockLoggerSpy).toHaveBeenCalledTimes(1);
      });

      test('reset to internal default logger', () => {
        logger.init(appName);
        logger.setLoggerOutput(mocks.loggerOutput);
        logger.setLoggerOutput(null);

        logger.log(LOGTYPES.Informational, 'unittest', 'test()', 'Logging to default logger');
        expect(consoleLogSpy).toHaveBeenCalledTimes(1);
        expect(mockLoggerSpy).toHaveBeenCalledTimes(0);
      });
    });

    /**
     * Log functions
     */
    describe('log functions', () => {
      test('log debug', () => {
        logger.init(appName);
        logger.setLoggerOutput(mocks.loggerOutput);

        logger.logDebug('unittest', 'test()', 'Log debug');
        expect(mockLoggerSpy).toBeCalledWith(expect.objectContaining({
          'logType': 0,
          'friendlyMsg': 'Log debug',
          'detailMsg': '',
          'appName': appName.toUpperCase(),
          'modName': 'unittest',
          'fnName': 'test()'
        }));
      });

      test('log info', () => {
        logger.init(appName);
        logger.setLoggerOutput(mocks.loggerOutput);

        logger.logInfo('unittest', 'test()', 'Log info');
        expect(mockLoggerSpy).toBeCalledWith(expect.objectContaining({
          'logType': 1,
          'friendlyMsg': 'Log info',
          'detailMsg': '',
          'appName': appName.toUpperCase(),
          'modName': 'unittest',
          'fnName': 'test()'
        }));
      });

      test('log warning', () => {
        logger.init(appName);
        logger.setLoggerOutput(mocks.loggerOutput);

        logger.logWarning('unittest', 'test()', 'Log warning');
        expect(mockLoggerSpy).toBeCalledWith(expect.objectContaining({
          'logType': 2,
          'friendlyMsg': 'Log warning',
          'detailMsg': '',
          'appName': appName.toUpperCase(),
          'modName': 'unittest',
          'fnName': 'test()'
        }));
      });

      test('log eror', () => {
        logger.init(appName);
        logger.setLoggerOutput(mocks.loggerOutput);

        logger.logError('unittest', 'test()', 'Log error');
        expect(mockLoggerSpy).toBeCalledWith(expect.objectContaining({
          'logType': 3,
          'friendlyMsg': 'Log error',
          'detailMsg': '',
          'appName': appName.toUpperCase(),
          'modName': 'unittest',
          'fnName': 'test()'
        }));
      });

      test('log critical error', () => {
        logger.init(appName);
        logger.setLoggerOutput(mocks.loggerOutput);

        logger.logCriticalError('unittest', 'test()', 'Log critical error');
        expect(mockLoggerSpy).toBeCalledWith(expect.objectContaining({
          'logType': 4,
          'friendlyMsg': 'Log critical error',
          'detailMsg': '',
          'appName': appName.toUpperCase(),
          'modName': 'unittest',
          'fnName': 'test()'
        }));
      });

      test('log with Error', () => {
        logger.init(appName);
        logger.setLoggerOutput(mocks.loggerOutput);

        try {
          throw new Error('Logging test error');
        } catch (e) {
          logger.logError('unittest', 'test()', e);
          expect(mockLoggerSpy).toBeCalledWith(expect.objectContaining({
            'logType': 3,
            'friendlyMsg': e.message,
            'detailMsg': e.stack,
            'appName': appName.toUpperCase(),
            'modName': 'unittest',
            'fnName': 'test()'
          }));
        }
      });

      test('log with friend and detail text', () => {
        logger.init(appName);
        logger.setLoggerOutput(mocks.loggerOutput);

        logger.logInfo('unittest', 'test()', 'Friendly Message', 'Detail Message');
        expect(mockLoggerSpy).toBeCalledWith(expect.objectContaining({
          'logType': 1,
          'friendlyMsg': 'Friendly Message',
          'detailMsg': 'Detail Message',
          'appName': appName.toUpperCase(),
          'modName': 'unittest',
          'fnName': 'test()'
        }));
      });

      test('log with task', () => {
        logger.init(appName);
        logger.setLoggerOutput(mocks.loggerOutput);

        logger.logInfo('unittest', 'test()', 'Friendly Message', 'Detail Message', 'UNITTEST-TASK');
        expect(mockLoggerSpy).toBeCalledWith(expect.objectContaining({
          'logType': 1,
          'friendlyMsg': 'Friendly Message',
          'detailMsg': 'Detail Message',
          'appName': appName.toUpperCase(),
          'modName': 'unittest',
          'fnName': 'test()',
          'task': 'UNITTEST-TASK'
        }));
      });

      test('log without module and function name using mock logger', () => {
        logger.init(appName);
        logger.setLoggerOutput(mocks.loggerOutput);

        logger.logInfo('', '', 'Friendly Message', 'Detail Message', 'UNITTEST-TASK');
        expect(mockLoggerSpy).toBeCalledWith(expect.objectContaining({
          'logType': 1,
          'friendlyMsg': 'Friendly Message',
          'detailMsg': 'Detail Message',
          'appName': appName.toUpperCase(),
          'modName': '',
          'fnName': '',
          'task': 'UNITTEST-TASK'
        }));
      });

      test('log without module and function name using internal default logger', () => {
        logger.init(appName);

        logger.logInfo('', '', 'Friendly Message', 'Detail Message', 'UNITTEST-TASK');
        expect(consoleLogSpy).toHaveBeenCalledWith(expect.stringContaining(' '));
      });
    });

    /**
     * Log object chaining
     */
    describe('log object chaining', () => {
      test('after init', () => {
        expect(logger.init(appName).appName()).toBe(appName.toUpperCase());
      });

      test('after log', () => {
        logger.init(appName);
        logger.log(LOGTYPES.Informational, 'unittest', 'test()', 'First Log').log(LOGTYPES.Warning, 'unittest', 'test()', 'Second Log');

        expect(consoleLogSpy).toHaveBeenCalledTimes(2);
        expect(consoleLogSpy).toHaveBeenNthCalledWith(1, expect.stringContaining('First Log'));
        expect(consoleLogSpy).toHaveBeenNthCalledWith(2, expect.stringContaining('Second Log'));
      });

      test('after log debug', () => {
        logger.init(appName);
        logger.logDebug('unittest', 'test()', 'First Log').log(LOGTYPES.Informational, 'unittest', 'test()', 'Second Log');

        expect(consoleLogSpy).toBeCalledTimes(2);
        expect(consoleLogSpy).toHaveBeenNthCalledWith(1, expect.stringContaining('First Log'));
        expect(consoleLogSpy).toHaveBeenNthCalledWith(2, expect.stringContaining('Second Log'));
      });

      test('after log info', () => {
        logger.init(appName);
        logger.logInfo('unittest', 'test()', 'First Log').log(LOGTYPES.Informational, 'unittest', 'test()', 'Second Log');

        expect(consoleLogSpy).toHaveBeenCalledTimes(2);
        expect(consoleLogSpy).toHaveBeenNthCalledWith(1, expect.stringContaining('First Log'));
        expect(consoleLogSpy).toHaveBeenNthCalledWith(2, expect.stringContaining('Second Log'));
      });

      test('after log warning', () => {
        logger.init(appName);
        logger.logWarning('unittest', 'test()', 'First Log').log(LOGTYPES.Informational, 'unittest', 'test()', 'Second Log');

        expect(consoleLogSpy).toHaveBeenCalledTimes(2);
        expect(consoleLogSpy).toHaveBeenNthCalledWith(1, expect.stringContaining('First Log'));
        expect(consoleLogSpy).toHaveBeenNthCalledWith(2, expect.stringContaining('Second Log'));
      });

      test('after log error', () => {
        logger.init(appName);
        logger.logError('unittest', 'test()', 'First Log').log(LOGTYPES.Informational, 'unittest', 'test()', 'Second Log');

        expect(consoleLogSpy).toHaveBeenCalledTimes(2);
        expect(consoleLogSpy).toHaveBeenNthCalledWith(1, expect.stringContaining('First Log'));
        expect(consoleLogSpy).toHaveBeenNthCalledWith(2, expect.stringContaining('Second Log'));
      });

      test('after log critical error', () => {
        logger.init(appName);
        logger.logCriticalError('unittest', 'test()', 'First Log').log(LOGTYPES.Informational, 'unittest', 'test()', 'Second Log');

        expect(consoleLogSpy).toHaveBeenCalledTimes(2);
        expect(consoleLogSpy).toHaveBeenNthCalledWith(1, expect.stringContaining('First Log'));
        expect(consoleLogSpy).toHaveBeenNthCalledWith(2, expect.stringContaining('Second Log'));
      });

      test('after set logger output', () => {
        logger.init(appName);
        logger.setLoggerOutput(mocks.loggerOutput).logWarning('unittest', 'test()', 'First Log').log(LOGTYPES.Informational, 'unittest', 'test()', 'Second Log');

        expect(consoleLogSpy).toHaveBeenCalledTimes(0);

        expect(mockLoggerSpy).toHaveBeenCalledTimes(2);
        expect(mockLoggerSpy).toHaveBeenNthCalledWith(1, expect.objectContaining({'friendlyMsg': 'First Log'}));
        expect(mockLoggerSpy).toHaveBeenNthCalledWith(2, expect.objectContaining({'friendlyMsg': 'Second Log'}));
      });
    });
  });

  /**
   * Unit tests for browser-or-node usage. Since this module
   * is used during simply-logger module load, we need to
   * load the logger module slightly different from other tests
   */
  describe('Browser-Or-Node Usage', () => {
    jest.mock('../src/browser-or-node-helper');

    // app name
    const appName: string = 'LoggerTest';
    const appName2: string = 'LoggerTest2';

    // spies
    let consoleLogSpy: jest.SpyInstance;
    let mockLoggerSpy: jest.SpyInstance;

    // mocks
    let bonMock: BonMockInterface;

    beforeAll(() => {
      // spy on console
      consoleLogSpy = jest.spyOn(console, 'log');
      mockLoggerSpy = jest.spyOn(mocks, 'loggerOutput');
    });

    beforeEach(() => {
      // reset all modules
      jest.clearAllMocks();
      jest.resetModules();
    });

    afterEach(() => {
      // clear mocks/spies between test
      jest.clearAllMocks();
    });

    test('isBrowser', () => {
      return import('../src/browser-or-node-helper').then((bonMod) => {
        bonMock = bonMod.default as any;  // typecast to mock since this is being mocked by Jest using our manual mock

        // set browser or node
        bonMock.__setValue(true, false, false);

        expect(bonMock.isBrowser()).toBeTruthy();
        expect(bonMock.isNode()).toBeFalsy();
        expect(bonMock.isJsDom()).toBeFalsy();

        return import('../src/simply-logger').then((logMod) => {
          // hold ref
          const logger = logMod.default;

          // initialize
          logger.init(appName);
          logger.setLoggerOutput(mocks.loggerOutput);   // use custom logger to get the JSON of log entry
          expect(logger.appName()).toEqual(appName.toUpperCase());
          expect(consoleLogSpy).toHaveBeenCalledTimes(0);
          expect(mockLoggerSpy).toHaveBeenCalledTimes(0);

          // initalize again to trigger default log entry to be created which will
          // use the browser-or-node module to build the appName
          logger.init(appName2);
          expect(logger.appName()).toEqual(appName.toUpperCase());
          expect(consoleLogSpy).toHaveBeenCalledTimes(0);
          expect(mockLoggerSpy).toHaveBeenCalledTimes(1);
          expect(mockLoggerSpy).toHaveBeenCalledWith(expect.objectContaining({
            'appName': 'browser-app'
          }));
        });
      });
    });

    test('isNode', () => {
      return import('../src/browser-or-node-helper').then((bonMod) => {
        bonMock = bonMod.default as any;  // typecast to mock since this is being mocked by Jest using our manual mock

        // set browser or node
        bonMock.__setValue(false, true, false);

        expect(bonMock.isBrowser()).toBeFalsy();
        expect(bonMock.isNode()).toBeTruthy();
        expect(bonMock.isJsDom()).toBeFalsy();

        return import('../src/simply-logger').then((logMod) => {
          // hold ref
          const logger = logMod.default;

          // initialize
          logger.init(appName);
          logger.setLoggerOutput(mocks.loggerOutput);   // use custom logger to get the JSON of log entry
          expect(logger.appName()).toEqual(appName.toUpperCase());
          expect(consoleLogSpy).toHaveBeenCalledTimes(0);
          expect(mockLoggerSpy).toHaveBeenCalledTimes(0);

          // initalize again to trigger default log entry to be created which will
          // use the browser-or-node module to build the appName
          logger.init(appName2);
          expect(logger.appName()).toEqual(appName.toUpperCase());
          expect(consoleLogSpy).toHaveBeenCalledTimes(0);
          expect(mockLoggerSpy).toHaveBeenCalledTimes(1);
          expect(mockLoggerSpy).toHaveBeenCalledWith(expect.objectContaining({
            'appName': 'node-app'
          }));
        });
      });
    });

    test('isJsDom', () => {
      return import('../src/browser-or-node-helper').then((bonMod) => {
        bonMock = bonMod.default as any;  // typecast to mock since this is being mocked by Jest using our manual mock

        // set browser or node
        bonMock.__setValue(false, false, true);

        expect(bonMock.isBrowser()).toBeFalsy();
        expect(bonMock.isNode()).toBeFalsy();
        expect(bonMock.isJsDom()).toBeTruthy();

        return import('../src/simply-logger').then((logMod) => {
          // hold ref
          const logger = logMod.default;

          // initialize
          logger.init(appName);
          logger.setLoggerOutput(mocks.loggerOutput);   // use custom logger to get the JSON of log entry
          expect(logger.appName()).toEqual(appName.toUpperCase());
          expect(consoleLogSpy).toHaveBeenCalledTimes(0);
          expect(mockLoggerSpy).toHaveBeenCalledTimes(0);

          // initalize again to trigger default log entry to be created which will
          // use the browser-or-node module to build the appName
          logger.init(appName2);
          expect(logger.appName()).toEqual(appName.toUpperCase());
          expect(consoleLogSpy).toHaveBeenCalledTimes(0);
          expect(mockLoggerSpy).toHaveBeenCalledTimes(1);
          expect(mockLoggerSpy).toHaveBeenCalledWith(expect.objectContaining({
            'appName': 'jsdom-app'
          }));
        });
      });
    });

    test('unknown', () => {
      return import('../src/browser-or-node-helper').then((bonMod) => {
        bonMock = bonMod.default as any;  // typecast to mock since this is being mocked by Jest using our manual mock

        // set browser or node
        bonMock.__setValue(false, false, false);

        expect(bonMock.isBrowser()).toBeFalsy();
        expect(bonMock.isNode()).toBeFalsy();
        expect(bonMock.isJsDom()).toBeFalsy();

        return import('../src/simply-logger').then((logMod) => {
          // hold ref
          const logger = logMod.default;

          // initialize
          logger.init(appName);
          logger.setLoggerOutput(mocks.loggerOutput);   // use custom logger to get the JSON of log entry
          expect(logger.appName()).toEqual(appName.toUpperCase());
          expect(consoleLogSpy).toHaveBeenCalledTimes(0);
          expect(mockLoggerSpy).toHaveBeenCalledTimes(0);

          // initalize again to trigger default log entry to be created which will
          // use the browser-or-node module to build the appName
          logger.init(appName2);
          expect(logger.appName()).toEqual(appName.toUpperCase());
          expect(consoleLogSpy).toHaveBeenCalledTimes(0);
          expect(mockLoggerSpy).toHaveBeenCalledTimes(1);
          expect(mockLoggerSpy).toHaveBeenCalledWith(expect.objectContaining({
            'appName': 'unknown-app'
          }));
        });
      });
    });
  });
});
