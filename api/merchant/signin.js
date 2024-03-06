import express from "express";
import bcrypt from "bcrypt";
import MerchantModel from "../../models/Merchant.js";


const merchantSigninRouter = express.Router();

merchantSigninRouter.post('/', (req, res) => {

    const { fullname, email, password } = req.body;

    if (!fullname || !email || !password) {

        res.status(401).json({
            status: 'FAILED',
            mssg: 'All Fields are requried'
        });

    } else {

        // check if user already exists
        MerchantModel.findOne({ email }).then((data) => {

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
                    mssg: "No Merchant has these details",
                })
            }


        }).catch((err) => {
            res.status(500).json({
                status: "FAILED",
                mss: "Server failed to find user, check network and try again"
            })
        })



    }

});

export default MerchantSigninRouter;
