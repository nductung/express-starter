import * as mailer from "nodemailer"
import InterfaceModelUser from "../interfaces/user.interface";

class SendMailService {

    public globals: any = global;

    public sendMail(mailTo: any, message: string, subject: string) {
        const port: number = parseInt(process.env.MAIL_PORT ? process.env.MAIL_PORT.toString() : "587", 10);
        const host: string = process.env.MAIL_HOST || "smtp.mailtrap.io";
        const transporter = mailer.createTransport({
            host,
            port,
            auth: {
                user: process.env.MAIL_USER || "933d9df2b87792",
                pass: process.env.MAIL_PASSWORD || "c9facdc8f6bd1e",
            }
        });
        const mailOptions = {
            from: "cs@minet.asia",
            to: mailTo,
            subject,
            html: message
        };

        return new Promise(async (resolve, reject) => {
            transporter.sendMail(mailOptions, (error: any) => {
                if (error) {
                    console.log(error);
                    resolve(false)
                } else {
                    resolve(true)
                }
            })
        });
    }

    async sendMailVerifiedAccount(user: InterfaceModelUser) {
        const key = `verify-account-${user.username}`;
        const otp = Math.floor(Math.random() * 999999 - 100000 + 1) + 100000;
        this.globals.__redis.set(key, otp);
        this.globals.__redis.expire(key, 900);
        const html = `
                        <p>Chào bạn <strong>${user.username}</strong>,</p>
                        <p>Bạn đã đăng kí tài khoản của bạn trên hệ thống.</p>
                        <p>Mã xác nhận của bạn là: ${otp}</p>
                        <p>Hãy điền mã xác nhận để hoàn tất quá trình này,</p>
                        <p>hoặc nhấp vào liên kết để xác thực tài khoản của bạn
                            <a href="http://localhost:4000/api/v1/authentication/verified-account?username=${user.username}&otp=${otp}">Verify your account</a>
                        </p>
                        <p>Trân trọng,</p>
                        <p>BQT Team.</p>
                    `;
        const sendEmail = await this.sendMail(user.email, html, `[ ] Mã code xác thực tài khoản ${user.username}`);
        return !!sendEmail;
    }

}

export default SendMailService
