import Jwt from "jsonwebtoken";
import UserModel from "../models/User.js";
import MerchantModel from "../models/Merchant.js";

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
        const { _id, user } = Jwt.verify(token, process.env.JWT_SECRET);

        if (user == "user") {
            req.user = await UserModel.findOne({ _id }).select('_id');
            next();

        } else if (user == "merchant") {
            req.user = await MerchantModel.findOne({ _id }).select('_id');
            next();

        } else {
            // create one for courier
        }

    } catch (error) {

        res.status(401).json({
            status: "FAILED",
            mssg: "Network error, could not verify token, please try again"
        })

    }

}

export default requireAuth;