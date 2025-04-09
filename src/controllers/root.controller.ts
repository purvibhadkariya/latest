import { Controller, Get } from "@overnightjs/core";
import resMiddlewareCommon from "../@utils/middlewares/resMiddleware";
import { Response, Request } from "express";

@Controller('')
export class RootController {
    @Get('')
    async root(req: Request, res: Response) {
        resMiddlewareCommon(res, true, "Success")
    }
}