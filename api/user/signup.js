import bcrypt from "bcrypt";
import validator from "validator";
import UserModel from "../../models/User.js";


// signup
const signup = async (req, res) => {
    // get post/user input

    let { email, password, fullname, phone } = req.body;
    fullname = fullname.trim();
    email = email ? email.trim() : false;
    password = password.trim();
    phone = phone ? phone.trim() : false;

    if (fullname == "" || password == "" || email == "" && phone == "") {
        res.status(400).json({
            status: "FAILED",
            mssg: "All Inputs are requried"
        })

    } else if (!/^[a-zA-Z\-,' ]+$/.test(fullname)) {
        // check if fullname properly formed
        res.status(400).json({
            status: "FAILED",
            mssg: "Fullname must contain only normal letters "
        })

    } else if (email && !validator.isEmail(email)) {
        // check if email is properly formed

        res.status(400).json({
            status: "FAILED",
            mssg: "Your email Is not properly formed"
        })

    } else if (phone && !/^[0-9, -]+$/.test(phone)) {
        res.status(400).json({
            status: "FAILED",
            mssg: "Your phone Is not properly formed"
        })

    } else if (password.length < 5) {
        res.status(400).json({
            status: "FAILED",
            mssg: "Your password must be more than 5 Characters."
        })
    } else {
        // check if user with email already exists
        UserModel.find({ $or: [{ email }, { phone }] }).then((result) => {
            if (result.length > 0) {
                res.status(400).json({
                    status: "FAILED",
                    mssg: "User with this email already exists"
                })
            } else {


                // encrypt the password and store data
                const salt = 10;
                bcrypt.hash(password, salt).then((hashedPass) => {

                    // find out if the user registered with an email or phone
                    const newUser = email ? new UserModel({ // Create a new user instance
                        password: hashedPass,
                        fullname,
                        email
                    }) : new UserModel({
                        password: hashedPass,
                        fullname,
                        phone
                    });

                    // Create a new user instance
                    newUser.save().then(result => {
                        res.status(200).json({
                            status: "SUCCESS",
                            mssg: "New user saved successfully",
                            data: result

                        })
                    }).catch((err) => {
                        res.status(400).json({
                            status: "FAILED",
                            mssg: "Error uccured saving user " + err
                        })
                    })

                }).catch((err) => {
                    res.status(400).json({
                        status: "FAILED",
                        mssg: "Error processing password"
                    })

                });

            }

        }).catch((err) => {

            res.status(400).json({
                status: "FAILED",
                mssg: "An error occured, please try again" + err
            })


        })
    }

};


export default signup