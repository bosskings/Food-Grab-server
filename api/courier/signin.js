import bcrypt from "bcrypt"
import CourierModel from "../../models/Courier.js";
import Jwt from "jsonwebtoken";

// function to sign jwt
const createSignedToken = (_id, user) => {
    return Jwt.sign({ _id, user },
        process.env.JWT_SECRET,
        { expiresIn: '36500d' }
    );
}

//function to aid Riders signin to their accounts
const courierSignin = async (req, res) => {
    try {
        const { email, password } = req.body;

        // check if a user exists with email
        const rider = await CourierModel.findOne({ email });
        if (!rider) {
            throw new Error('No user found with given email ' + email);
        }

        // compare passwords
        const passMatch = await bcrypt.compare(password, rider.password);

        if (!passMatch) {
            throw new Error(" passwords do not match! ")
        }

        // check if email is verified
        if (rider.emailVerificationStatus != "VERIFIED") {
            throw new Error("Your Email is not yet verified")
        }

        // create signed json web token

        const token = createSignedToken(rider._id, 'courier')

        // send response
        res.status(200).json({
            status: "SUCCESS",
            mssg: "signup successful",
            token,
            data: rider
        })

    } catch (error) {

        return res.status(500).json({
            status: "FAILED",
            mssg: "unexpected error " + error
        })
    }
}

export default courierSignin