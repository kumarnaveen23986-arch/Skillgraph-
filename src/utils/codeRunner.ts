import { TestCase } from '../types';

export interface TestResultItem {
  inputDescription: string;
  expectedOutput: string;
  actualOutput: string;
  passed: boolean;
  error?: string;
}

export interface RunResult {
  success: boolean;
  logs: string[];
  testResults: TestResultItem[];
  allPassed: boolean;
  error?: string;
  executionTimeMs: number;
}

export const runCodeWithTests = async (
  userCode: string,
  testCases: TestCase[] = []
): Promise<RunResult> => {
  const startTime = performance.now();
  const logs: string[] = [];
  const testResults: TestResultItem[] = [];

  // Custom log interceptor
  const originalLog = console.log;
  const customLog = (...args: any[]) => {
    logs.push(
      args
        .map((arg) => {
          if (typeof arg === 'object') {
            try {
              return JSON.stringify(arg);
            } catch {
              return String(arg);
            }
          }
          return String(arg);
        })
        .join(' ')
    );
  };

  try {
    // Basic safety check for dangerous patterns
    if (
      userCode.includes('document.cookie') ||
      userCode.includes('window.location') ||
      userCode.includes('localStorage.clear') ||
      userCode.includes('fetch(') ||
      userCode.includes('XMLHttpRequest')
    ) {
      throw new Error('Restricted API detected in playground for security reasons.');
    }

    // Prepare sandbox
    // We execute userCode inside a wrapper function that provides `console.log`
    // and returns the inner scope or evaluates test cases.
    const runSandbox = new Function(
      'console',
      `
      "use strict";
      ${userCode}
      return {
        evalTestCase: function(expr) {
          return eval(expr);
        }
      };
    `
    );

    const sandbox = runSandbox({ log: customLog, error: customLog, warn: customLog, info: customLog });

    // Evaluate each test case
    let allPassed = testCases.length > 0;

    for (const tc of testCases) {
      try {
        const result = sandbox.evalTestCase(tc.evalSnippet);
        const actualStr = JSON.stringify(result);
        const expectedClean = tc.expectedOutput.trim();

        // Compare formatted strings
        let passed = false;
        try {
          // Check if expected is valid JSON
          const expectedParsed = JSON.parse(expectedClean);
          passed = JSON.stringify(result) === JSON.stringify(expectedParsed);
        } catch {
          passed = String(result) === expectedClean || actualStr === expectedClean;
        }

        if (!passed) allPassed = false;

        testResults.push({
          inputDescription: tc.inputDescription,
          expectedOutput: tc.expectedOutput,
          actualOutput: actualStr !== undefined ? actualStr : String(result),
          passed,
        });
      } catch (tcErr: any) {
        allPassed = false;
        testResults.push({
          inputDescription: tc.inputDescription,
          expectedOutput: tc.expectedOutput,
          actualOutput: 'Error thrown',
          passed: false,
          error: tcErr?.message || String(tcErr),
        });
      }
    }

    const endTime = performance.now();

    return {
      success: true,
      logs,
      testResults,
      allPassed: testCases.length > 0 ? allPassed : true,
      executionTimeMs: Math.round(endTime - startTime),
    };
  } catch (err: any) {
    const endTime = performance.now();
    return {
      success: false,
      logs,
      testResults: [],
      allPassed: false,
      error: err?.message || 'Execution error',
      executionTimeMs: Math.round(endTime - startTime),
    };
  }
};
