import { createLogger, format, transports } from 'winston';
import * as winston from 'winston';
import * as path from 'path';
import 'winston-daily-rotate-file';

const logger = createLogger();

const printFormat = format.printf((info) => {
	return `${info.timestamp} ${info.level}: ${info.message}`;
});

if (process.env.LOGS_PATH) {
  logger.add(new winston.transports.DailyRotateFile({
    filename: path.resolve(process.env.LOGS_PATH, 'application-%DATE%.log'),
    datePattern: 'YYYY-MM-DD',
    maxSize: '20m',
    maxFiles: '14d',
    format: format.combine(
      format.timestamp(),
      format.json()
    )
  }));
}

if (process.env.NODE_ENV !== "production") {
  logger.add(new transports.Console({
    level: 'debug',
    handleExceptions: true,
    format: format.combine(
      format.colorize(),
      format.timestamp(),
      printFormat,
    ),
  }))
}

export default logger;