import express, { response } from "express";

import UserModel from "../../models/User.js";
import bcrypt from "bcrypt";

const router = express.Router();

// signup
router.post('/signup', (req, res) => {
    // get post/user input

    let { email, password, fullname, phone } = req.body;
    fullname = fullname.trim();
    email = email ? email.trim() : false;
    password = password.trim();
    phone = phone ? phone.trim() : false;

    if (fullname == "" || password == "" || email == "" && phone == "") {
        res.json({
            status: "FAILED",
            mssg: "All Inputs are requried"
        })

    } else if (!/^[a-zA-Z\-,' ]+$/.test(fullname)) {
        // check if fullname properly formed
        res.json({
            status: "FAILED",
            mssg: "Fullname must contain only normal letters "
        })

    } else if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)) {
        // check if email properly formed

        res.json({
            status: "FAILED",
            mssg: "Your email Is not properly formed"
        })

    } else if (password.length < 8) {
        res.json({
            status: "FAILED",
            mssg: "Password must be more that 8 chartacter"
        })
    } else {
        // check if user with email already exists
        UserModel.find({ email }).then((result) => {
            if (result.length > 0) {
                res.json({
                    status: "FAILED",
                    mssg: "User with this email already exists"
                })
            } else {

                // find out if the user registered with an email or phone
                const emailOrPass = email ? `email : ${email}` : `phone : ${phone}`;

                // encrypt the password and store data
                const salt = 10;
                bcrypt.hash(password, salt).then((hashedPass) => {

                    // Create a new user instance
                    const newUser = new UserModel({
                        password: hashedPass,
                        fullname,
                        emailOrPass
                    });

                    newUser.save().then(result => {
                        res.json({
                            status: "SUCCESS",
                            mssg: "New user saved successfully",
                            data: result

                        })
                    }).catch((err) => {
                        res.json({
                            status: "FAILED",
                            mssg: "Error uccured saving user " + err
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
                mssg: "Ann error occured, please try again"
            })


        })
    }



})



// signin
router.post('/signin', (req, res) => {

})


export default router