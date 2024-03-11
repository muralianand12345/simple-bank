import mongoose from "mongoose";
import * as path from "path";
import * as express from "express";
import * as dotenv from "dotenv";
import * as dbRoutes from "./route/db";
import * as loginRoutes from "./route/login";
import * as session from "express-session";
import * as uuid from "uuid";

import { checkLogin } from "./function/auth";

dotenv.config();
const MONGO_URL: string | undefined = process.env.MONGO_URL;
const PORT: string | undefined = process.env.PORT || '3000';

if (!MONGO_URL) {
    throw new Error('MONGO_URL must be provided');
}

mongoose.connect(MONGO_URL)
    .then(() => {
        console.log('Connected to MongoDB');
    }).catch((error) => {
        console.log('Error connecting to MongoDB', error);
    });

const app = express();

//cookie
const secretKey = uuid.v4();
app.use(session({
    secret: secretKey,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));

app.use(express.json());
app.use('/css', express.static(path.join(__dirname, './web/css')));
app.use('/js', express.static(path.join(__dirname, './web/js')));

app.use('/db', dbRoutes.router);
app.use('/auth', loginRoutes.router);

app.get('/', checkLogin, (req, res) => {
    res.sendFile(path.join(__dirname, './web', 'home.html'));
});

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, './web', 'login.html'));
});

app.get('/logout', (req, res) => {
    req.session.destroy(() => {
        res.redirect('/');
    });
});

app.use((req, res) => {
    res.status(404).send('Not Found');
});

app.listen(parseInt(PORT), () => {
    console.log(`Server is running on port ${PORT}`);
});