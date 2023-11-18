import express from "express";
import * as homeController from "../controllers/homeController";
import * as auth from "../controllers/accountController"
let route=express.Router();

let initWebRoutes = (app)=>{

    //home page
    route.get('/', homeController.getMainPage);
    route.get('/login', auth.showLogin );
    route.get('/register',auth.showRegister);

    route.get('/home', auth.isAuth, (req, res) => {
        res.render('auth/homePage');
    });
    route.post('/register', auth.register);
    route.post('/register/otp' , auth.verifyOTOP);
    route.post('/login', auth.login);

   

    //.get('/logout', authMiddleware.loggedin, login.logout)

    //route.get('/verify', auth.verify)


    return app.use("/", route)
}

module.exports = initWebRoutes;