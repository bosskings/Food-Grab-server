import CourierModel from "../../models/Courier.js";
import MerchantModel from "../../models/Merchant.js";
import UserModel from "../../models/User.js";
import sendEmail from "../../utils/sendMail.js";
import bcrypt from "bcrypt"


// a function to carry out all the steps in recovering a password
const recoverPassword = async (req, res) => {

    // first, send get the email address of the user,
    // send em a verification email with a token
    const { step } = req.query

    try {

        // check what step the system is on via a query param
        if (step == 'FIRST') {
            const { email } = req.body
            // collect email address from user and verify it by sendin a token

            // create token, encrypt it and send to user via email
            let random = Math.floor(1000 + Math.random() * 9000)
            let hashedToken = await bcrypt.hash(String(random), 10);

            if (hashedToken) {
                const message = `Your verification token is ${random}`;

                // store in database
                const result = await CourierModel.findOneAndUpdate({ email }, { testToken: hashedToken }, { new: true })

                if (!result) {
                    throw new Error("User not found")
                }

                // send email to user 
                const response = await sendEmail(email, message, 'RECOVER PASSWORD TOKEN')

                if (!response) {
                    throw new Error("Verification token could not be sent, please check your network and try again")
                }

                return res.status(200).json({
                    status: "SUCCESS",
                    mssg: "Verification token sent successfully, please check your email ",
                })
            }


        }

        if (step == 'SECOND') {

            const { token, email } = req.body

            // get token and verify it 
            if (!token) {
                throw new Error('wrong token')
            }

            // verify the tokens, confirm it matches the one stored in DB already
            const user = await CourierModel.findOne({ email })

            const result = await bcrypt.compare(token, user.testToken);

            if (!result) {
                throw new Error('The token provided in not correct')
            }

            // store in database
            await CourierModel.findOneAndUpdate({ email }, { testToken: 'NULL' }, { new: true })

            return res.status(200).json({
                status: "SUCCESS",
                mssg: "Token was verified successfully please proceed to update password ",
            })

        }

        if (step == 'THIRD') {

            const { newPassword, email } = req.body

            if (!newPassword) {
                throw new Error('Please provide a new password')
            }

            // when verified, hash the new password and update the user's password in the database

            const hashedPassword = await bcrypt.hash(newPassword, 10)
            const result = await CourierModel.findOneAndUpdate({ email }, { password: hashedPassword }, { new: true })

            if (!result) {
                throw new Error('Password could not be updated, please try again')
            }

            return res.status(201).json({
                status: "SUCCESS",
                mssg: "Password updated successfully, please login again",
            })

        }


    } catch (error) {

        return res.status(501).json({
            status: "FAILED",
            mssg: " error occured: " + error
        })
    }

}


// function to enable user update/change their password

const updatePassword = async (req, res) => {

    try {

        const { oldPassword, newPassword } = req.body

        if (!oldPassword && !newPassword) {
            throw new Error('old and new passwords must be provided')
        }

        // confirm that old password matches the current existing password
        const user = CourierModel.findOne({ _id: req.users._id })

        const result = await bcrypt.compare(oldPassword, user.password)

        if (!result) {
            throw new Error('old password does not match')
        }

        // if it does, then update the password to the new password provided
        const hashedPassword = await bcrypt.hash(newPassword, 10) //encrypting new password
        const update = await CourierModel.findOneAndUpdate({ _id: req.users._id }, { password: hashedPassword }, { new: true })

        if (!update) {
            throw new Error('Password could not be updated, please try again')
        }

        return res.status(201).json({
            status: "SUCCESS",
            mssg: "Password updated successfully, please login again",
            data: update
        })

    } catch (error) {
        return res.status(501).json({
            status: "FAILED",
            mssg: " error occured: " + error
        })
    }

}

export { recoverPassword, updatePassword }