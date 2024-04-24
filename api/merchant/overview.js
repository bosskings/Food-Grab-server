import CuisineModel from "../../models/Cuisine.js";
import OrdersModel from "../../models/Order.js";
import ShopModel from "../../models/Shop.js";
import UserModel from "../../models/User.js";
import sendEmail from "../../utils/sendMail.js";

const createOverview = async (req, res) => {

    try {

        //create an object to store different informations and give em default values
        let overview = { accountBalance: 0, totalOrders: 0, pendingOrders: 0, successfulOrders: 0 }


        // get shop id belonging to this merchant
        let { _id: shopId } = await ShopModel.findOne({ merchantId: req.user._id }).select('_Id');

        // get account balance from merchants collection
        let balance = await ShopModel.findById({ _id: shopId }).select('walletBalance');

        if (!balance || balance.length == 0) {
            throw new Error("No Balance found");
        } else {
            // add the gotten value to object
            overview.accountBalance = balance.walletBalance;
        }


        // get totalOrders

        let total = await OrdersModel.find({ shopId }).select();
        if (!total || total.length == 0) {
            throw new Error("No merchant found with provided id");
        } else {
            // add the gotten value to object
            overview.totalOrders = total.length;

        }


        // get pending orders
        let pending = await OrdersModel.find({ requestStatus: 'PENDING', shopId }, '_id')
        if (!pending) {
            throw new Error("No pending orders Found")
        } else {
            overview.pendingOrders = pending.length;
        }

        // get successful orders

        let success = await OrdersModel.find({ requestStatus: 'DELIVERED', shopId }, '_id')
        if (!success) {
            throw new Error("No successfull orders Found")
        } else {
            overview.successfulOrders = success.length;
        }


        // send back the data in a json format
        return res.status(400).json({
            status: "SUCCESS",
            data: overview
        })

    } catch (error) {
        return res.status(400).json({
            status: "FAILED",
            mssg: "Error: " + error
        })
    }


}



// create function to get orders for merchants

const getOrders = async (req, res) => {

    try {

        // check if any ids were sent as url params
        // send a single order if soo
        const id = req.query.id
        if (id) {
            let order = await OrdersModel.findById(id);

            if (!order) {
                throw new Error('Order not found');
            } else {
                return res.status(200).json({
                    status: 'SUCCESS',
                    data: order

                });
            }

        } else {
            // if no ids provided in the url, 
            // then we will provide all of them

            let orders = await OrdersModel.find({}, "-__v").sort({ date: -1 }).exec();
            return res.status(200).json({
                status: 'SUCCESS',
                data: orders
            })
        }

    } catch (error) {
        return res.status(400).json({
            status: "FAILED",
            mssg: "An Error occurred" + error
        })
    }

}



// create function to enable merchants shops update orderstatus
const updateOrderStatus = async (req, res) => {
    try {
        const id = req.params.id;
        const updates = Object.keys(req.body);
        console.log("updates", updates);

        if (updates.length === 0) {
            throw new Error("Please select at least one field to be updated")
        }

        const order = await OrdersModel.findByIdAndUpdate(id, req.body, { new: true }).exec()

        if (order) {

            // send email notification when an order is delivered or cancelled
            // first get users email address with the users id

            let userEmailAddr = await UserModel.findOne({ _id: order.userId }, "email").exec();
            userEmailAddr = userEmailAddr.email;

            sendEmail(userEmailAddr, ` Dear User, your order from FoodGrab.africa is ${order.requestStatus} `, "Your Order From FoodGrab.africa");

            return res.status(200).json({
                status: "SUCCESS",
                mssg: `Order status updated to ${order.requestStatus}`,
                data: order
            })
        } else {
            throw new Error(`No record found with the given ID ${id}`);
        }
    } catch (error) {

        return res.status(400).json({
            status: "FAILED",
            mssg: "An error occorred " + error
        });
    }
}



export {
    createOverview,
    getOrders,
    updateOrderStatus
};