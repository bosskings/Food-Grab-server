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
            req.user = { type: "USER" };
            req.user._id = (await UserModel.findById(_id, '_id'))._id;
            if (!req.user._id) {
                throw new Error('Wrong token, please try to login again')
            }
            next();

        } else if (user == "merchant") {
            req.user = { type: "MERCHANT" };
            req.user._id = (await MerchantModel.findById(_id, '_id'))._id;
            if (!req.user._id) {
                throw new Error('Wrong token, please try to login again')
            }
            next();

        } else if (user == 'courier') {
            // create one for courier
            console.log('courier logged in');
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

    const error = new Error(`Not found - ${req.originalUrl}`);
    res.status(404).send(error);
    next();

}


export { requireAuth, secureRoutes };