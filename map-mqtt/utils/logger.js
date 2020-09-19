import winston from 'winston';
import fs from 'fs';
import path from 'path';

const { createLogger, format, transports } = winston;
const env = process.env.NODE_ENV || 'development';
const logDir = 'log';

// Create the log directory if it does not exist
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

const filename = path.join(logDir, 'results.log');


const generateLogger = (label) =>
  createLogger({
    // change level if in dev environment versus production
    level: env === 'production' ? 'info' : 'debug',
    format: format.combine(
      format.label({ label }),
      format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' })
    ),
    transports: [
      new transports.Console({
        format: format.combine(
          format.colorize(),
          format.json(),
          format.printf(
            info =>
              `${info.timestamp} ${info.level} [${info.label}]: ${info.message}`
          )
        )
      }),
      new transports.File({
        filename,
        format: format.combine(
          format.json(),
          format.printf(
            info =>
              `${info.timestamp} [${info.label}] ${info.level}: ${info.message}`
          )
        )
      })
    ]
  });

export const mqttLogger = generateLogger('mqtt');
export const wsLogger = generateLogger('ws');
export const appLogger = generateLogger('app');
