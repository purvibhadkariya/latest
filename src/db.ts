import * as config from './config';
import { logger } from './logger';
import mongoose from "mongoose";

let dbUrl = 'mongodb://' + config.DB_HOST + '/' + config.DB_NAME;

if (config.DB_USERNAME && config.DB_PASSWORD && config.DB_SOURCE) {
    dbUrl = 'mongodb://' + config.DB_USERNAME + ':' +
        config.DB_PASSWORD + '@' + config.DB_HOST +
        '/' + config.DB_NAME + '?authSource=' + config.DB_SOURCE
}

export const connect = async () => {
    mongoose.connection.on('connected', () => { logger.info(`Db connected to ${config.DB_HOST} with user ${config.DB_SOURCE}`); });
    mongoose.connection.on('close', () => { logger.error('lost Db connection'); });
    mongoose.connection.on('reconnected', () => { logger.info('Db reconnected'); });
    mongoose.connection.on('error', () => { logger.error('Db connection error'); });
    mongoose.connect(dbUrl);
}

export const close = () => {
    mongoose.connection.close();
}