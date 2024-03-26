import nodemailer from "nodemailer";

const sendEmail = (to, message, title) => {

    const transporter = nodemailer.createTransport({
        service: "gmail",
        host: "smtp.gmail.com",
        port: 587,
        auth: {
            user: "FoodGrabafrica@gmail.com",
            pass: process.env.EMAIL_PASSWORD,
        }
    })


    // transporter.verify((err, success) => {
    //     if (err) {
    //         console.log(err);
    //     } else {
    //         console.log('ready to send mails', success);
    //     }
    // })

    const mailOptions = {
        from: 'FoodGrab Africa <foodgrabafrica@gmail.com>', // sender address
        to: to, // list of receivers
        subject: title, // Subject line
        html: `<div>${message}</div>`// HTML body content
    };

    return new Promise((resolve, reject) => {

        transporter.sendMail(mailOptions, (err, info) => {
            if (err) {
                reject('error' + err);

            } else {
                resolve('sent');
            }
        })

    })

}

export default sendEmail