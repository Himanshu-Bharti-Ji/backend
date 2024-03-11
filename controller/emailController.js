const nodemailer = require("nodemailer");
const { asyncHandeler } = require("../utils/asyncHandeler.js");

const sendEmail = async (data, req, res) => {

    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false, // Use `true` for port 465, `false` for all other ports
        auth: {
            user: process.env.MAIL_ID,
            pass: process.env.MAIL_PASS,
        },
    });

    // send mail with defined transport object
    const info = await transporter.sendMail({
        from: '"Hey 👻" <abc@gmail.com>', // sender address
        to: data.to, // list of receivers
        subject: data.subject, // Subject line
        text: data.text, // plain text body
        html: data.html, // html body
    });

    console.log("Message sent: %s", info.messageId);
    // Message sent: <d786aa62-4e0a-070a-47ed-0b0666549519@ethereal.email>
}

module.exports = sendEmail