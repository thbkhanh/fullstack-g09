import bcrypt from "bcrypt";
import account from "../models/user";
import mailController from "./mailController";
import mail from "../config/mail";
require ('dotenv').config();


// middlewares kiểm tra người dùng đăng nhập hay chưa 
let loggedin = (req, res, next) => {
    if (req.session.loggedin) {
        res.locals.user = req.session.user
        next();
    } else {
        res.redirect('/login')
    }
}

let isAuth = (req, res, next) => {
    if (req.session.loggedin) {
        res.locals.user = req.session.user
        res.redirect('/home');
    } else {
        next();
    }
}


let showLogin = (req, res)=>{
    return res.render('login.ejs');
}
let showRegister = (req, res)=>{
    return res.render('register.ejs');
}
let showVerifyOtp = (req, res) =>{
    return res.render('verifyOtp.ejs');
}

let login = (req, res) => {
    const { username, password } = req.body;
    
    
    if (username && password) {
        account.findUser(username, (err, user) => {
            if (!user) {
                const conflictError = 'Tài khoản hoặc mật khẩu không chính xác';
                return res.render('login.ejs', {conflictError });
            } 
            else {
                bcrypt.compare(password, user.PASSWORDS, (err, result) => {
                    if (!err) {
                        //req.session.loggedin = true;
                        //req.session.user = user;
                        return res.redirect('/home'); // Điều hướng đến "/homePage   
                    } 
                    else {
                        // Mật khẩu không hợp lệ

                        
                        const conflictError= "Tài khoản hoặc mật khẩu không chính xác.";
                        res.render('login.ejs', {conflictError });
                        
                    }
                })
            }
        })
    } 
    else {
        // Người dùng không cung cấp thông tin đăng nhập
        const conflictError = 'Vui lòng cung cấp tên người dùng và mật khẩu.';
        return res.render('account.ejs', {conflictError });
    }
}

let register = (req, res) => {
    const { new_username, new_password, mail } = req.body;
    console.log(new_username, new_password, mail);
    if (new_username && new_password && mail) {
        console.log('K');
        account.findUser(new_username, (err, user) => { // kiểm tra user có tồn tại không 
            if (user) {
                console.log('K1');
                const errorRegister = 'Tài khoản đã tồn tại!';
                return res.render('account.ejs', { errorRegister });
                
            } 
            if(!user) {
                console.log('K2');
                const ac = { new_username, new_password, mail };
                account.createAccount(ac, (err, message) => {
                    if (err) {
                        const errorRegister = message;
                        console.log(message);
                        res.render('register.ejs', { errorRegister });
                    } else {
                        mailController.sendMail(ac.mail, "Verify Email",  (err, otp) => {
                            if (err) {
                                // Xử lý lỗi gửi email
                                const errorRegister = 'Lỗi gửi email xác minh';
                                res.render('register.ejs', { errorRegister });
                            } else {
                                req.session.otp=otp;
                                res.render('verifyOtp.ejs');
                            }
                        });
                    }
                });
            }
        });
    } else {
        const errorRegister = 'Vui lòng điền đầy đủ thông tin';
        return res.render('register.ejs', { errorRegister });
    }
}
let verifyOtp = (req, res) =>{
    const OTP = req.body;
    console.log(req.body);
    if(OTP){
        console.log('OTP XÁC MMINH');
        if(OTP == req.session.otp){
            res.render('auth/homePage.ejs');
        }

    } else{
        console.log('ADMIN');
        
    }
}

let logout = (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.redirect('/500');
           
        } else {
            return res.redirect('/');
        }
    })
    
}
module.exports = {
    loggedin: loggedin,
    isAuth: isAuth,
    showLogin: showLogin, 
    showRegister: showRegister,
    showVerifyOtp: showVerifyOtp,
    login: login,
    logout: logout,
    register: register,
    verifyOtp: verifyOtp,

}
