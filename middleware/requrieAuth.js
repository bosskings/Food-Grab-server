import Jwt from "jsonwebtoken";
import UserModel from "../models/User.js";
import MerchantModel from "../models/Merchant.js";
import CourierModel from "../models/Courier.js";

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
            req.user = { type: "USER" };
            req.user = (await UserModel.findById(_id));
            if (!req.user._id) {
                throw new Error('Wrong token, please try to login again')
            }
            next();

        } else if (user == "merchant") {
            req.user = (await MerchantModel.findById(_id));
            req.user.userType = "MERCHANT";

            if (!req.user._id) {
                throw new Error('Wrong token, please try to login again')
            }
            next();

        } else if (user == 'courier') {
            // create one for courier
            req.user = (await CourierModel.findById(_id));
            req.user.userType = "COURIER"

            if (!req.user._id) {
                throw new Error('Wrong token, please try to login again')
            }
            next();

        } else if (user == "admin") {
            // for admin login  
            req.user = { type: "ADMIN" };
            req.user._id = "0";
            if (_id != "0") {
                throw new Error('Wrong token, please try to login again')
            }
            next();

        }

    } catch (error) {

        return res.status(401).json({
            status: "FAILED",
            mssg: "Network error, could not verify token, please try again" + error
        })

    }

}


// for wrong pages
const secureRoutes = (req, res, next) => {
    res.status(404).json({
        status: "FAILED",
        mssg: "Route not found"
    });

    next()
}


export { requireAuth, secureRoutes };