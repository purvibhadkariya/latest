import { Response } from "express";
import { CODES } from "../../constants";
import { logger } from "../../logger";

export default function resMiddlewareCommon(res: Response, success: boolean, message: string, data?: any, code = CODES.DEFAULT) {
    if (!success) {
        logger.error(message)
    }
    return res.send({
        data: data,
        success: success,
        message: message,
        code: code,
    });
}