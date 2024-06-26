import bcrypt from "bcrypt";
import validator from "validator";
import sendEmail from "../../utils/sendMail.js";
import MerchantModel from "../../models/Merchant.js";

// signup
const merchantSignup = async (req, res) => {
    // get post/user input


    let { email, password, firstname, lastname, phone, NIN, passport } = req.body;
    firstname = firstname.trim();
    lastname = lastname.trim();
    email = email.trim();
    password = password.trim();

    if (lastname == "" || lastname == "" || password == "" || email == "" || phone == "" || NIN == "") {
        res.json({
            status: "FAILED",
            mssg: "All Inputs are requried"
        })

    } else if (!/^[a-zA-Z\-,' ]+$/.test(firstname) || !/^[a-zA-Z\-,' ]+$/.test(lastname)) {
        // check if fullname properly formed
        res.json({
            status: "FAILED",
            mssg: "Names must contain only normal letters "
        })

    } else if (email && !validator.isEmail(email)) {
        // check if email is properly formed

        res.json({
            status: "FAILED",
            mssg: "Your email Is not properly formed"
        })

    } else if (password.length < 5) {
        res.json({
            status: "FAILED",
            mssg: "Password must be more that 5 chartacter"
        })
    } else {
        // check if user with email already exists
        MerchantModel.find({ $or: [{ email }, { phone }] }).then((result) => {
            if (result.length > 0) {
                res.json({
                    status: "FAILED",
                    mssg: "Merchant with same details already exists"
                })
            } else {

                // encrypt the password and store data
                const salt = 10;
                bcrypt.hash(password, salt).then((hashedPass) => {


                    // send email with verification code
                    const randomValue = Math.floor(1000 + Math.random() * 9000);

                    bcrypt.hash(String(randomValue), salt).then(hashedCode => {


                        // find out if the user registered with an email or phone
                        const newUser = new MerchantModel({ // Create a new user instance
                            password: hashedPass,
                            firstname,
                            lastname,
                            email,
                            phone,
                            NIN,
                            emailVerificationStatus: hashedCode
                        });

                        // Create a new user instance
                        newUser.save().then(result => {

                            sendEmail(email, randomValue, "ACCOUNT VERIFICATION").then((success) => {

                                res.json({
                                    status: "SUCCESS",
                                    mssg: "email sent successfully to " + email,
                                    data: result

                                })
                            })

                        }).catch((err) => {
                            res.json({
                                status: "FAILED",
                                mssg: "Error uccured saving Merchant " + err
                            })
                        })

                    })

                }).catch((err) => {
                    res.json({
                        status: "FAILED",
                        mssg: "Error processing password"
                    })

                });

            }

        }).catch((err) => {

            res.json({
                status: "FAILED",
                mssg: "An error occured, please try again" + err
            })


        })
    }



};



// verify mercant email
// function to verify code
const verifyCode = async (req, res) => {
    try {
        const { code, email } = req.body;

        if (!code || !email) {
            throw new Error("Provide code and email");
        } else {
            // get the user by email
            let user = await MerchantModel.findOne({ email });

            if (user) {
                // compare the sent code with the stored one in DB
                const isMatch = await bcrypt.compare(code, user.emailVerificationStatus);

                if (isMatch) {
                    // update the status of the user
                    const result = await MerchantModel.updateOne(
                        { _id: user._id },
                        { $set: { emailVerificationStatus: 'VERIFIED' } }
                    );

                    if (result.modifiedCount > 0) {
                        res.status(201).json({
                            status: "SUCCESS",
                            mssg: "Verification successfull",
                        });
                    } else {
                        throw new Error("Verification update failed");
                    }
                } else {
                    throw new Error('Wrong Verification Code!');
                }
            } else {
                throw new Error('No user found with the provided email');
            }
        }
    } catch (error) {
        res.status(401).json({
            status: "FAILED",
            mssg: error.message,
        });
    }
}


export { merchantSignup, verifyCode }