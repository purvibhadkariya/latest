import express from "express";
import * as mongo from './db'
import { logger } from "./logger";
import { Server } from "@overnightjs/core";
import * as controllers from './controllers';
import { PORT } from "./config";
import { json, raw, urlencoded } from "body-parser";
import morganMiddleware from "./@utils/middlewares/morganMiddleware";
import cors from "cors";
import { EventEmitter } from "events";
EventEmitter.setMaxListeners(1000000);//setting maxlisteners to ignore warnings


export default class Main extends Server {

    constructor() {
        super();
        this.corsPolicy();
        this.middleWare();
        mongo.connect().then(connect => {
            this.loadControllers();
        });
    }
    private corsPolicy() {
        express.Router()
        this.app.use((req, res, next) => {
            res.header("Access-Control-Allow-Origin", "*");
            res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE,OPTIONS");
            res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, user, Authorization, Client-Type");
            next();
        });
        this.app.use(cors({
            origin: '*',
            methods: "GET, PUT, POST, DELETE, OPTIONS",
            credentials: true
        }))
    }

    private middleWare() {
        this.app.use(json({ limit: '5mb' }));
        this.app.use(express.urlencoded({ extended: false }))
        this.app.use(morganMiddleware)
        this.app.use(urlencoded({ limit: '5mb', extended: true }));
        this.app.use(raw({ limit: '5mb' }));
        this.app.use(express.static('public'))
    }

    private loadControllers() {
        const controllerInstances = [];
        for (const name of Object.keys(controllers)) {
            const controller = (controllers as any)[name];
            if (typeof controller === 'function') {
                controllerInstances.push(new controller());
            }
        }
        this.addControllers(controllerInstances, undefined);
    }

    private setupShutDownProcess(server: any) {
        // Graceful shutdown
        process.on('SIGINT', () => {
            const cleanUp = async () => {
                // Clean up other resources like DB connections
                await mongo.close();
            }
            logger.info('Closing server...')
            server.close(() => {
                logger.info('Server closed !!! ')
                cleanUp()
                process.exit()
            });
            // Force close server after 5secs
            setTimeout((e: any) => {
                logger.info('Forcing server close !!!', e)
                cleanUp()
                process.exit(1)
            }, 5000);
        });
    }

    public start() {
        const server: any = this.app.listen(PORT, () => {
            logger.info("Server Started at Port :" + PORT);
            this.setupShutDownProcess(server);
        })
    }
}