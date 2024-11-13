const { format, createLogger, transports } = require("winston");
require("winston-daily-rotate-file");
const { combine, timestamp, label, printf, colorize } = format;
//Using the printf format.
const util = require("util");

// eslint-disable-next-line no-unused-vars
function transform(info, opts) {
  const args = info[Symbol.for("splat")];
  if (args) {
    info.message = util.format(info.message, ...args);
  }
  return info;
}

function utilFormatter() {
  return { transform };
}

exports.initLogger = () => {};
const customFormat = printf(({ level, message, label, timestamp }) => {
  return `${timestamp} [${label}] ${level}: ${message}`;
});
var transport = new transports.DailyRotateFile({
  level: "verbose",
  filename: `logs/${process.env.LABEL}-%DATE%.log`,
  zippedArchive: true,
  format: combine(
    label({ label: process.env.LABEL }),
    timestamp({ format: "YYYY-MM-DD HH:mm:ss.SSS" }),
    utilFormatter(), // <-- this is what changed
    // colorize({ all: true }),
    customFormat,
  ),
  maxSize: "20m",
  maxFiles: "14d",
});
var transportError = new transports.DailyRotateFile({
  level: "error",
  filename: `logs/${process.env.LABEL}-%DATE%-error.log`,
  zippedArchive: true,
  format: combine(
    label({ label: process.env.LABEL }),
    timestamp({ format: "YYYY-MM-DD HH:mm:ss.SSS" }),
    utilFormatter(), // <-- this is what changed
    // colorize({ all: true }),
    customFormat,
  ),
  maxSize: process.env.LOG_MAX_SIZE ?? "20m",
  maxFiles: process.env.LOG_MAX_DAY ?? "14d",
});
var transportConsole = new transports.Console({
  level: "verbose",
  format: combine(
    label({ label: process.env.LABEL }),
    timestamp({ format: "YYYY-MM-DD HH:mm:ss.SSS" }),
    utilFormatter(), // <-- this is what changed
    colorize({ all: true }),
    customFormat,
  ),
});
const transportList = [];
transportList.push(transportConsole);
transportList.push(transport);
transportList.push(transportError);

const logger = createLogger({
  level: "verbose",
  transports: transportList,
});

// transport.on("rotate", function (oldFilename, newFilename) {});
// Override the base console log with winston
console.log = function () {
  return logger.info.apply(logger, arguments);
};
console.error = function () {
  return logger.error.apply(logger, arguments);
};
console.info = function () {
  return logger.warn.apply(logger, arguments);
};

module.exports.logger = logger;
