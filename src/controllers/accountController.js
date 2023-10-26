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
    return res.render('account.ejs');

}
let login = (req, res) => {
    const { username, password } = req.body;
    
    if (username && password) {
        account.findUser(username, (err, user) => {
            if (!user) {
                const conflictError = 'Tài khoản hoặc mật khẩu không chính xác';
                return res.render('account.ejs', {conflictError });
            } 
            else {
                bcrypt.compare(password, user.PASSWORDS, (err, result) => {
                    if (!err) {
                        //req.session.loggedin = true;
                        //req.session.user = user;
                        return res.redirect('/'); // Điều hướng đến "/homePage   
                    } 
                    else {
                        // Mật khẩu không hợp lệ
                        
                        const conflictError= "Tài khoản hoặc mật khẩu không chính xác.";
                        res.render('account.ejs', {conflictError });
                        
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
    const { new_username, password, mail } = req.body;
    if (new_username && password && mail) {
        account.findUser(new_username, (err, user) => { // kiểm tra user có tồn tại không 
            if (user) {
                const errorRegister = 'Tài khoản đã tồn tại!';
                return res.render('account.ejs', { errorRegister });
            } 
            if(!user) {
                const ac = { new_username, password, mail };
                account.createAccount(ac, (err, message) => {
                    if (err) {
                        // Xử lý lỗi ở đây
                        const errorRegister = 'Lỗi đăng ký';
                        res.render('account.ejs', { errorRegister });
                    } else {
                        // Gửi email và sau đó chuyển hướng
                        mailController.sendMail(ac.mail, "Verify Email",  (err, otp) => {
                            console.log("kt");
                            console.log("OTP1" + otp );
                            if (err) {
                                // Xử lý lỗi gửi email
                                const errorRegister = 'Lỗi gửi email xác minh';
                                res.render('account.ejs', { errorRegister });
                            } else {
                                // Kiểm tra mã otp nhập 
                                res.redirect('/login');
                            }
                        });
                    }
                });
            }
        });
    } else {
        const errorRegister = 'Vui lòng điền đầy đủ thông tin';
        return res.render('account.ejs', { errorRegister });
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
    login: login,
    logout: logout,
    register: register,
}
