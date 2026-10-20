import * as ChildProcess from "effect/process/ChildProcess";
export const harnessCommand = (harness, args, options = {}) => ChildProcess.make(harness, args, {
    shell: (options.platform ?? process.platform) === "win32",
    stdin: options.inherit ? "inherit" : "pipe",
    stdout: options.inherit ? "inherit" : "pipe",
    stderr: options.inherit ? "inherit" : "pipe",
});
