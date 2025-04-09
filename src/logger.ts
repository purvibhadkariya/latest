import * as winston from 'winston';
import { LOGS_PATH } from './config';


const ConsoleLogTransport = new winston.transports.Console({
    level: 'silly',
    handleExceptions: true
})


// Generic Error/Exception Logger Handler 
const UnCaughtExceptionHandler = new winston.transports.File({ filename: `${LOGS_PATH}/exceptions.log` });


export const logger = winston.createLogger({
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.printf(info => `[${info.timestamp}] : [${info.level}] ${info.message}`)
    ),
    transports: [
        ConsoleLogTransport,
    ],
    exceptionHandlers: [
        UnCaughtExceptionHandler
    ],
    exitOnError: false
});

class CustomLoggerStream {
    write(text: string) {
        logger.info(text.trim())
    }
}

export const customLoggerStream = new CustomLoggerStream();