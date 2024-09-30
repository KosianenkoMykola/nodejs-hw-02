import nodemailer from "nodemailer";
import "dotenv/config";

const {SMTP_PASSWORD, SMTP_FROM} = process.env;

const nodemailerConfig = {
    host: "smtp.ukr.net",
    port: 465, 
    secure: true,
    auth: {
        user: SMTP_FROM,
        pass: SMTP_PASSWORD,
    }
};

const transport = nodemailer.createTransport(nodemailerConfig);

const sendEmail = data => {
    const email = {...data, from: SMTP_FROM};
    return transport.sendMail(email);
};

export default sendEmail;