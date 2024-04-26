import Jwt from "jsonwebtoken";
import bcrypt from "bcrypt"

// function to sign jwt
const createSignedToken = (_id, user) => {
    return Jwt.sign({ _id, user },
        process.env.JWT_SECRET,
        { expiresIn: '1d' }
    );
}

const adminSignin = async (req, res) => {
    try {
        // get admin input
        const { email, password } = req.body;

        if (!email || !password) {
            throw new Error('Email and password is needed');
        }

        // check if the input info matches stored info
        if (email == process.env.ADMINEMAIL && password == process.env.ADMINPASSWORD) {
            let token = createSignedToken("0", 'admin')

            return res.status(200).send({
                status: "SUCCESS",
                token,
                message: `Welcome Admin!`
            })
        } else {
            throw new Error('Invalid login details ' + process.env.ADMINEMAIL, process.env.ADMINPASSWORD);
        }

    } catch (error) {
        throw new Error('Unexpected Error ' + error)
    }
}

export default adminSignin;