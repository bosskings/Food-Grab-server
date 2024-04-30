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


const merchantSignin = async (req, res) => {

    const { email, password } = req.body;

    try {

        if (!email || !password) {

            res.status(401).json({
                status: 'FAILED',
                mssg: 'All Fields are requried'
            });

        } else {

            // check if user already exists
            const data = await MerchantModel.findOne({ email })

            if (!data) {
                throw new Error("Failed to find user with email")

            }

            // check if email is verified
            if (data.emailVerificationStatus != "VERIFIED") {
                throw new Error("Your Email is not yet verified")
            }

            // user exists, compare passwords
            const hashedPassword = data.password;
            const result = await bcrypt.compare(password, hashedPassword)

            if (!result) {
                throw new Error("Incorrect Password")
            }

            const token = createSignedToken(data._id, 'merchant')
            res.status(200).json({
                status: 'SUCCESS',
                token,
                data: data
            })
        }

    } catch (error) {
        res.status(500).json({
            status: "FAILED",
            mssg: "Error occured " + error
        })
    }

};

export default merchantSignin;
