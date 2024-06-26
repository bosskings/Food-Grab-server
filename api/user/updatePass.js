import UserModel from "../../models/User.js";
import sendEmail from "../../utils/sendMail.js";
import bcrypt from "bcrypt"


// a function to carry out all the steps in recovering a password
const recoverPassword = async (req, res) => {

    // first, send get the email address of the user,
    // send em a verification email with a token
    const { step, email } = req.query

    try {

        // check what step the system is on via a query param
        if (step == 'FIRST') {
            // collect email address from user and verify it by sendin a token

            // create token, encrypt it and send to user via email
            let random = Math.floor(1000 + Math.random() * 9000)
            let hashedToken = await bcrypt.hash(String(random), 10);

            if (hashedToken) {
                const message = `Your verification token is ${random}`;

                // store in database
                const result = await UserModel.findOneAndUpdate({ _id: req.users._id }, { testToken: hashedToken }, { new: true })

                if (!result) {
                    throw new Error("User not found")
                }

                // send email to user 
                const response = await sendEmail(email, message, 'EMAIL VERIFICATION')

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

            const { token } = req.query

            // get token and verify it 
            if (!token) {
                throw new Error('wrong token')
            }

            // verify the tokens, confirm it matches the one stored in DB already
            const storedToken = await UserModel.findById(req.users._id, testToken)

            const result = await bcrypt.compare(token, storedToken);

            if (!result) {
                throw new Error('The token provided in not correct')
            }

            return res.status(200).json({
                status: "SUCCESS",
                mssg: "Verification token sent successfully, please check your email ",
            })

        }

        if (step == 'THIRD') {

            const { newPassword } = req.query

            // when verified, hash the new password and update the user's password in the database

            const hashedPassword = await bcrypt.hash(newPassword, 10)
            const result = await UserModel.findByIdAndUpdate(req.users._id, { password: hashedPassword }, { new: true })

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

export { recoverPassword }