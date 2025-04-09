import { Controller, Get, Middleware, Post } from "@overnightjs/core";
import { Request, Response } from "express";
import { getUserDetailsById, login, signup } from "../../services/auth.service";
import resMiddlewareCommon from "../../@utils/middlewares/resMiddleware";
// import { intializeMulter } from "../../services/multer.service";
    


@Controller('auth')
export class AuthController {

    @Post('login')
    async login(req: Request, res: Response) {
        try {
            const { contact, password } = req.body;
            const data = await login(contact, password)
            resMiddlewareCommon(res, true, "success", data)
        } catch (error: any) {
            resMiddlewareCommon(res, false, "Something Went Wrong. please try again");
        }
    }               


    @Post('signup')
    async signUp(req: Request, res: Response) {
        try {
          const { userName, contact, password } = req.body;
          console.log(req.body);
          // const { userName, contact, password } = JSON.parse(req.body.data);
          const data = await signup(req, userName, contact, password);
          console.log(data);
          resMiddlewareCommon(res, true, "success", data);
        } catch (error: any) {
            resMiddlewareCommon(res, false, "Something Went Wrong. please try again");
        }
    }

    @Post('user-details')
    async getUserDetails(req: any, res: Response) {
        try {
            const userId = req.body.id;
            const data = await getUserDetailsById(userId);
            resMiddlewareCommon(res, true, "user details", data)
        } catch (error: any) {
            resMiddlewareCommon(res, false, "Something Went Wrong. please try again")
        }
    }

}