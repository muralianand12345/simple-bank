import * as express from "express";
import { Login } from '../schema/login';
import rateLimit from "express-rate-limit";
import { v4 as uuidv4 } from 'uuid';

import { CustomSession } from '../function/auth';

const router = express.Router();

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
    message: { code: 429, message: "Too many requests. Please try again later." }
});

router.post('/login', limiter, async (req, res) => {

    try {

        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ code: 400, message: "Invalid request. Please provide username and password." });
        }

        var user = await Login.findOne({ username });

        if (!user) {
            let genRanAccountID: number = Math.floor(Math.random() * 1000000);
            user = new Login({ username, password, accountID: genRanAccountID });
            await user.save();
        }

        if (user.password !== password) {
            return res.status(401).json({ code: 401, message: "Invalid username or password" });
        }

        if (!req.session) {
            throw new Error("Session is not available");
        }

        let customSession = req.session as CustomSession;

        customSession.isLogin = true;
        customSession.username = username;
        customSession.accountID = user.accountID;
        customSession.sessionAuth = uuidv4();
        req.session.save();

        return res.status(200).json({ code: 200, message: "Login successful", sessionAuth: customSession.sessionAuth });

    } catch (error) {
        console.error(error);
        res.status(500).json({ code: 500, message: "Internal server error" });
    }
});

export { router };