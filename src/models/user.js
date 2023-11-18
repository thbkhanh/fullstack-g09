import sql from "./db";
import bcrypt from "bcrypt"
let findUser = (USERNAME, result) => {
    sql.query("SELECT * FROM USERS WHERE USERNAME = ?", [USERNAME], (err, res) => {
        if (err) {
            result(err, null);
            return;
        }
        if (res.length) {
            result(null, res[0]);
            return;
        }
        result(null, null);
    });
}

let createAccount =(ac, result) =>{
    bcrypt.hash(ac.new_password, 10, (err, pass)=> {
        if(err){
            result(err, err);
        }
        else{
            sql.query("CALL CREATE_USER (?, ?, ?, @err)", [ac.new_username, pass, ac.mail], (err, message) =>{
                if(err){
                    result(err, err);
                }
                else{
                    result(null, "Đã thêm vào csdl");
                }
            });
        }
        return;
    });
} 



module.exports = {
    findUser: findUser,
    createAccount: createAccount,
}
