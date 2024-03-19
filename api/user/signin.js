import bcrypt from "bcrypt";
import Jwt from "jsonwebtoken";
import UserModel from "../../models/User.js";


// functino to sign jwt
const createSignedToken = (_id, user) => {
    return Jwt.sign({ _id, user },
        process.env.JWT_SECRET,
        { expiresIn: '36500d' }
    );
}

// function to verify code
const verifyCode = async (req, res) => {
    try {
        const { code, email } = req.body;

        if (!code || !email) {
            throw new Error("Provide code and email");
        } else {
            // get the user by email
            let user = await UserModel.findOne({ email });

            if (user) {
                // compare the sent code with the stored one in DB
                const isMatch = await bcrypt.compare(code, user.emailVerificationStatus);

                if (isMatch) {
                    // update the status of the user
                    const result = await UserModel.updateOne(
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



// function to sign users in
const signin = async (req, res) => {

    let { email, password, phone } = req.body;
    email = email ? email.trim() : false;
    password = password.trim();
    phone = phone ? phone.trim() : false;


    if (!password || !phone && !email) {
        res.status(401).json({
            status: "FAILED",
            mssg: "All Inputs are requried"
        })
    } else {
        // check if a user exists with said email or phone
        UserModel.findOne({ $or: [{ email }, { phone }] }).then((data) => {
            if (data) {

                if (data.emailVerificationStatus == "VERIFIED") {

                    // user exists, compare passwords
                    const hashedPassword = data.password;
                    bcrypt.compare(password, hashedPassword).then((result) => {
                        if (result) {

                            // tokenize user id
                            const token = createSignedToken(data._id, 'user')
                            res.header("auth-token", token).status(200).json({
                                status: 'SUCCESS',
                                token,
                                data: data
                            })


                        } else {
                            req.status(401).json({
                                status: "FAILED",
                                mssg: "Incorrect Password"
                            })
                        }
                    }).catch(err => {
                        res.status(500).json({
                            status: "FAILED",
                            mssg: "Sever failed trying to compare passwords"
                        })
                    })
                } else {
                    throw new Error("Your Email is not yet verified")
                }

            } else {
                // user doesnt exists, send error message
                res.status(401).json({
                    status: "FAILED",
                    mssg: "No user has these details",
                })
            }
        }).catch(err => {
            res.status(500).json({
                status: "FAILED",
                mssg: "Server failed to find user, check network and try again" + err
            })
        })
    }

};

export {
    signin,
    verifyCode
};