import express from "express";
import homePage from "../controllers/homeController"
import homeController from "../controllers/homeController";
import account from "../controllers/accountController"
let route=express.Router();

let initWebRoutes = (app)=>{
    route.get('/', homeController.getHomePage);
    route.get('/account', account.showLogin);
    route.post('/login', account.login);
    route.post('/register', account.register);
    return app.use("/", route)
}

module.exports = initWebRoutes;