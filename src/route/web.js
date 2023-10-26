import express from "express";
import * as homeController from "../controllers/homeController";
import * as auth from "../controllers/accountController"
let route=express.Router();

let initWebRoutes = (app)=>{

    //home page
    route.get('/', homeController.getHomePage);
    route.get('/home', auth.isAuth, (req, res) => {
        homeController.getHomePage;
    });
    // auth route
    route.get('/account', auth.isAuth, (req, res)=>{
        res.render('account')
        //auth.showLogin;
    }) ;
    route.get('/login', auth.showLogin);
    route.post('/login', auth.login);

    route.get('/register', auth.isAuth, auth.register);
    route.post('/register', auth.register);

    //.get('/logout', authMiddleware.loggedin, login.logout)

    //route.get('/verify', auth.verify)


    return app.use("/", route)
}

module.exports = initWebRoutes;