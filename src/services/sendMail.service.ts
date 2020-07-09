import * as mailer from "nodemailer"

export default async function SendEmailService(mailTo: any, message: string, subject: string) {
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
