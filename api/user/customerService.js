import express from "express";
import validator from "validator";
import sendEmail from "../../utils/sendMail.js";
import CustomerServiceModel from "../../models/CustomerService.js";


// function to send messages from users to admin email account

const sendMessage = async (req, res) => {

    try {

        const { message, phone, email, fullname, userId } = req.body;

        // validate phone and email then send an email to the admin
        const isEmail = validator.isEmail(email);
        const isNumber = validator.isNumeric(phone);

        if (isEmail && isNumber) {
            // send email to the admin
            let emailBody = `${message} \n ${phone} \n ${email} \n ${fullname} `;
            let emailTitle = `Message From ${fullname}`;

            const mailSent = sendEmail('foodgrabafrica@gmail.com', emailBody, emailTitle);

            if (mailSent) {

                // store message if email has been sent
                let newCustomerServiceModel = new CustomerServiceModel({
                    email, phone, userId, message, fullname
                });

                const result = await newCustomerServiceModel.save()

                if (result) {
                    return res.status(201).json({
                        status: 'SUCCESS',
                        mssg: 'Your Message has been sent successfully! We will get back'
                    });

                }

            } else {
                throw new Error("Error, Please check your network connection and try again")
            }

        } else {
            throw new Error("Email or phone is not properly formed")
        }

    } catch (error) {
        return res.status(201).json({
            status: 'FAILED',
            mssg: error
        });
    }



}



export default sendMessage;