import bcrypt from "bcrypt"
import account from "../models/user";
import sql from "../models/db";

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

let register = (req, res) =>{
    const {new_username, password, mail} =req.body;
    if (new_username && password && mail) {
        account.findUser(new_username, (err, user) => {
            if (user) {
                const errorRegister = 'Tài khoản đã tồn tại!';
                return  res.render('account.ejs', {errorRegister});
            } 
            else {
                const ac ={new_username, password, mail}
                account.createAccount( ac, (err, message) =>{
                    if(err){
                        const errorRegister = 'Lỗi đăng ký';
                        return res.render('account.ejs', {errorRegister}); 
                    }
                    else {
                        const errorRegister = message;
                        return res.render('account.ejs', {errorRegister});
                    }
                });
            } 
        });
    } 
    else{
        const errorRegister= 'Vui lòng điền đầy đủa thông tin';
        return res.render('account.ejs', {errorRegister });
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
    showLogin: showLogin, 
    login: login,
    logout: logout,
    register: register,
}
