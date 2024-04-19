import bcrypt from "bcrypt";
import Jwt from "jsonwebtoken";
import MerchantModel from "../../models/Merchant.js";



// functino to sign jwt
const createSignedToken = (_id, user) => {
    return Jwt.sign({ _id, user },
        process.env.JWT_SECRET,
        { expiresIn: '36500d' }
    );
}


const merchantSignin = (req, res) => {

    const { firstName, lastName, email, password } = req.body;

    if (!email || !password) {

        res.status(401).json({
            status: 'FAILED',
            mssg: 'All Fields are requried'
        });

    } else {

        // check if user already exists
        MerchantModel.findOne({ email }).then((data) => {

            if (data) {

                // user exists, compare passwords
                const hashedPassword = data.password;
                bcrypt.compare(password, hashedPassword).then((result) => {
                    if (result) {

                        const token = createSignedToken(data._id, 'merchant')
                        res.status(200).json({
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
                        mssg: "Sever failed trying to compare passwords" + err
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

};

export default merchantSignin;
