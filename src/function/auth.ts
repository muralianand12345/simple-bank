import { Request, Response, NextFunction } from 'express';
import { Session } from 'express-session';


interface CustomSession extends Session {
    isLogin?: boolean;
    username?: string;
    accountID?: number;
    sessionAuth?: string;
}

const checkLogin = (req: Request & { session: CustomSession }, res: Response, next: NextFunction) => {
    if (req.session && req.session.isLogin) {
        next();
    } else {
        res.redirect('/login');
    }
};

const sessionAuth = (req: Request & { session: CustomSession }, res: Response, next: NextFunction) => {


    if (!req.session) {
        res.status(500).json({ code: 500, message: "Internal server error." });
        return;
    }

    let sessionAuth = req.session?.sessionAuth;
    let headerAuth = req.header('x-api-key');
    if (sessionAuth && headerAuth && sessionAuth === headerAuth) {
        next();
    } else {
        res.status(403).json({ code: 403, message: "Forbidden. Invalid Session Auth" });
    }
};

export { checkLogin, sessionAuth, CustomSession };