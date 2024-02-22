import express from "express";
import bcrypt from "bcrypt";
import UserModel from "../../models/User.js";

const signinRouter = express.Router();

signinRouter.post("/", (req, res) => {

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
        // check if a user exists with said email 
        UserModel.find({ $or: [{ email }, { phone }] }).then((data) => {
            if (data) {

                // user exists, compare passwords
                const hashedPassword = data[0].password;
                bcrypt.compare(password, hashedPassword).then((result) => {
                    if (result) {
                        res.status(200).json({
                            status: 'SUCCESS',
                            mss: "Signin Success",
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
                // user doesnt exists, send error message
                res.status(401).json({
                    status: "FAILED",
                    mssg: "No user has these details",
                })
            }
        }).catch(err => {
            res.status(500).json({
                status: "FAILED",
                mss: "Server failed to find user, check network and try again"
            })
        })
    }

});

export default signinRouter