import bcrypt from "bcrypt";
import validator from "validator";
import MerchantModel from "../../models/Merchant.js";

// signup
const merchantSignup = async (req, res) => {
    // get post/user input

    let { email, password, firstname, lastname, phone } = req.body;
    firstname = firstname.trim();
    lastname = lastname.trim();
    email = email.trim();
    password = password.trim();

    if (lastname == "" || lastname == "" || password == "" || email == "" || phone == "") {
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

                    // find out if the user registered with an email or phone
                    const newUser = new MerchantModel({ // Create a new user instance
                        password: hashedPass,
                        firstname,
                        lastname,
                        email,
                        phone
                    });

                    // Create a new user instance
                    newUser.save().then(result => {
                        res.json({
                            status: "SUCCESS",
                            data: result

                        })
                    }).catch((err) => {
                        res.json({
                            status: "FAILED",
                            mssg: "Error uccured saving Merchant " + err
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


export default merchantSignup