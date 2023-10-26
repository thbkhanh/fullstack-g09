import nodeMailer from "nodemailer";
import mailConfig from "../config/mail";
require ('dotenv').config();


let generateOTP= (length)=> {
    const charset = "0123456789"; // Các ký tự sẽ được sử dụng trong mã OTP
    let otp = "";
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * charset.length);
        otp += charset[randomIndex];
    }
    return otp;
}
const OTP = generateOTP(6);

const htmlContent = `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <title>Xác nhận OTP</title>
            </head>
            <body>
                <div>
                    <h1>Xác nhận OTP</h1>
                    <p>Xin chào,</p>
                    <p>Hãy xác nhận OTP để hoàn thành quá trình đăng ký tài khoản.</p>
                    <p>Mã OTP của bạn: <strong>${OTP}</strong></p>
                    <p>Vui lòng nhập mã OTP này vào ứng dụng hoặc trang web của chúng tôi.</p>
                    <p>Nếu bạn không thực hiện yêu cầu này, bạn có thể bỏ qua email này.</p>
                    <p>Xin cảm ơn!</p>
                </div>
            </body>
            </html>
        `

let sendMail = (to, subject, resull) =>{
    const transport = nodeMailer.createTransport({
        host: mailConfig.HOST,
        port: mailConfig.PORT,
        secure: false,
        auth: {
            user: mailConfig.USERNAME,
            pass: mailConfig.PASSWORD,
        }
    })
    const options = {
        from: mailConfig.FROM_ADDRESS,
        to: to,
        subject: subject,
        html: htmlContent,
        
    }
    transport.sendMail(options, (err, otp)=>{
        if(err){

            resull(err, null);
        } else{
            resull(null, OTP)
        }
    })
    return;

} 

module.exports = {
    sendMail : sendMail,
}