import express from "express";
import bodyParser, { BodyParser } from "body-parser";
import viewEngine from "./config/viewEngine";
import initWebRoutes from "./route/web";
import session from "express-session";
require ('dotenv').config();
let app = express();

//config app
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true}));

//config session
app.use(session({
    secret: 'mySecretKey',
    resave: false,
    saveUninitialized: false,
}));

viewEngine(app);
initWebRoutes(app);
let port = process.env.PORT || 6969;

app.listen(port, ()=>{
    console.log(" runing on the port: "+ port);
})