import * as mailer from "nodemailer"
import InterfaceModelUser from "../interfaces/user.interface";
import GenerateService from "./generate.service";

class SendMailService {

    public globals: any = global;
    private generateService = new GenerateService();

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

    async sendMailVerifyAccount(user: InterfaceModelUser) {
        const key = `verify-account-${user.username}`;
        const otp = this.generateService.generateOtp();
        this.globals.__redis.set(key, otp);
        this.globals.__redis.expire(key, 900);
        const html = `
                        <p>Chào bạn <strong>${user.username}</strong>,</p>
                        <p>Bạn đã đăng kí tài khoản của bạn trên hệ thống.</p>
                        <p>Mã xác minh của bạn là: ${otp}</p>
                        <p>Hãy điền mã xác minh để hoàn tất quá trình này,</p>
                        <p>hoặc nhấp vào liên kết để xác minh tài khoản của bạn
                            <a href="${process.env.BASE_URL}/api/v1/authentication/verify-account?email=${user.email}&otp=${otp}">Verify your account</a>
                        </p>
                        <p>Trân trọng,</p>
                        <p>BQT Team.</p>
                    `;
        const sendEmail = await this.sendMail(user.email, html, `[ ] Mã xác minh tài khoản ${user.username}`);
        return !!sendEmail;
    }

    async sendMailForgotPassword(user: InterfaceModelUser) {
        const key = `forgot-password-${user.username}`;
        const otp = this.generateService.generateOtp();
        this.globals.__redis.set(key, otp);
        this.globals.__redis.expire(key, 900);
        const html = `
                        <p>Chào bạn <strong>${user.username}</strong>,</p>
                        <p>Mã xác minh của bạn là: ${otp}</p>
                        <a href="#?email=${user.email}&otp=${otp}"
                        style="color: white;
                            padding: .75rem 1.1875rem;
                            border-radius: 8px;
                            border: none;
                            text-decoration: none;
                            text-transform: uppercase;
                            font-weight: bold;
                            background-image: linear-gradient(90deg,#2ce69b,#00d68f);">
                            Verify your account
                            </a>
                        <p>Trân trọng,</p>
                        <p>BQT Team.</p>
                    `;
        const sendEmail = await this.sendMail(user.email, html, `[ ] Mã xác minh quên mật khẩu tài khoản ${user.username}`);
        return !!sendEmail;
    }

}

export default SendMailService
