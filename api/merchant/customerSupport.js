import validator from "validator";
import sendEmail from "../../utils/sendMail.js";
import CustomerServiceModel from "../../models/CustomerService.js";


// function to send messages from users to admin email account

const sendMessage = async (req, res) => {

    try {

        const { message, phone, email, fullname } = req.body;
        if (!message || !phone, !email || !fullname) {
            throw new Error("Email, phone numbe, fullname and message must be provided")
        }

        // validate phone and email then send an email to the admin
        const isEmail = validator.isEmail(email);
        const isNumber = validator.isNumeric(phone);

        if (isEmail && isNumber) {
            // send email to the admin
            let emailBody = `${message} \n ${phone} \n ${email} \n ${fullname} `;
            let emailTitle = `Message From MERCHANT ${fullname}`;

            const mailSent = sendEmail('foodgrabafrica@gmail.com', emailBody, emailTitle);

            if (mailSent) {

                // store message if email has been sent
                let newCustomerServiceModel = new CustomerServiceModel({
                    email, phone, userId: req.user._id, message, fullname, userType: "MERCHANT"
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



// get sent messages
const getSentMessage = async (req, res) => {
    try {
        const data = await CustomerServiceModel.find({ userId: req.user._id }, "-__v");

        if (!data) {
            throw new Error('No document found')
        }

        return res.status(200).json({
            status: "SUCCESS",
            data
        });

    } catch (error) {
        return res.status(404).json({
            status: "FAILED",
            mssg: error
        });
    }
}



export { sendMessage, getSentMessage };