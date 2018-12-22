// import * as bunyan from 'bunyan';
// import * as util from 'util';

// const startTime = new Date().getTime();

// export function createLoggerFromFilename(filename: string): any {
//     const name = filename.slice(filename.lastIndexOf("/")+1);
//     return createLogger(name);
// }

// export function createLogger(name: string) : bunyan.Logger {
//     return bunyan.createLogger({
//         name: name,
//         streams: [{
//             level: bunyan.INFO,
//             stream: <NodeJS.WritableStream>new ConsoleStream(),
//             type: 'raw'
//         }]
//     });
// }

// function formattime(rec: any) {
//     const t = rec.time.getTime()-startTime;
//     let secs = Number(t/1000).toFixed(3);
//     const len = 10;
//     return Array((len + 1) - (secs + '').length).join('0') + secs;
// }

// class ConsoleStream  {
//     write(rec: any) : boolean {
//         let logMethod;
//         let levelStr;
//         if (rec.level < bunyan.INFO) {
//             logMethod = console.log;
//         } else if (rec.level < bunyan.WARN) {
//             logMethod = console.info;
//         } else if (rec.level < bunyan.ERROR) {
//             logMethod = console.warn;
//         } else {
//             logMethod = console.error;
//         }
//         switch (rec.level) {
//             case bunyan.INFO: levelStr = "INFO "; break;
//             case bunyan.ERROR: levelStr = "ERROR"; break;
//             case bunyan.DEBUG: levelStr = "DEBUG"; break;
//             case bunyan.FATAL: levelStr = "FATAL"; break;
//             case bunyan.TRACE: levelStr = "TRACE"; break;
//             case bunyan.WARN: levelStr = "WARN "; break;
//             default: levelStr = "LEVEL="+rec.level; break;
//         }
//         logMethod(util.format("%s %s %s %s", formattime(rec), levelStr, rec.name, rec.msg));
//         return true;
//     }
// }

