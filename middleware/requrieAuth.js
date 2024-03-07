import Jwt from "jsonwebtoken";
import UserModel from "../models/User.js";

const requireAuth = async (req, res, next) => {
    // verify authentication

    const { authorization } = req.headers;

    if (!authorization) {
        return res.status(401).json({
            status: "FAILED",
            mssg: "authorization token reqiuired"
        })
    }

    const token = authorization.split(' ')[1];
    try {
        const { _id } = Jwt.verify(token, process.env.JWT_SECRETE);
        req.user = await UserModel.findOne({ _id }).select('_id');
        next();
    } catch (error) {

        res.status(401).json({
            status: "FAILED",
            mssg: "Network error, could not verify token, please try again"
        })

    }

}

export default requireAuth;