import express from "express";
import * as homeController from "../controllers/homeController";
import * as auth from "../controllers/accountController"
let route=express.Router();

let initWebRoutes = (app)=>{

    //home page
    route.get('/', homeController.getMainPage);
    route.get('/account', auth.showLogin );

    route.get('/home', auth.isAuth, (req, res) => {
        res.render('homePage');
    });
    // auth route
    
    route.post('/login', auth.login);

    route.get('/register', auth.isAuth, auth.register);
    route.post('/register', auth.register);

    //.get('/logout', authMiddleware.loggedin, login.logout)

    //route.get('/verify', auth.verify)


    return app.use("/", route)
}

module.exports = initWebRoutes;