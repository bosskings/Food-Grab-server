import CuisineModel from "../../models/Cuisine.js";
import OrdersModel from "../../models/Order.js";
import ShopModel from "../../models/Shop.js";
import UserModel from "../../models/User.js";
import sendEmail from "../../utils/sendMail.js";

const createOverview = async (req, res) => {

    try {

        //create an object to store different informations and give em default values
        let overview = { accountBalance: 0.00, totalOrders: 0.00, pendingOrders: 0.00, successfulOrders: 0.00 }


        // get shop id belonging to this merchant
        let result = await ShopModel.findOne({ merchantId: req.user._id }).select('_id');
        let shopId;
        if (result) {
            shopId = result._id;

        } else {

            return res.status(201).json({
                status: "SUCCESS",
                mssg: 'No shop found for the user',
                data: overview
            })
        }

        // get account balance from merchants collection
        let balance = await ShopModel.findById({ _id: shopId }).select('walletBalance');

        if (!balance) {
            throw new Error("No Balance found");
        } else {
            // add the gotten value to object
            overview.accountBalance = balance.walletBalance;
        }


        // get totalOrders
        let orders = await OrdersModel.find({ shopId }).select();
        if (!orders) {
            throw new Error("No Orders found with ");
        } else {
            // add the gotten value to object
            overview.totalOrders = orders.length;

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
        return res.status(200).json({
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
            let order = await OrdersModel.findById(id).populate('userId');

            if (!order) {
                throw new Error('Order not found');
            } else {
                return res.status(200).json({
                    status: 'SUCCESS',
                    data: order

                });
            }

        } else {
            // we will provide all of them from d user logged in

            // get shopId from merchants
            let shopId = req.user.shopId;

            //check if user has any shop
            if (!shopId) {
                throw new Error("Merchant doesn't have any shops");
            }

            let orders = await OrdersModel.find({ shopId }, "-__v").populate('userId');

            if (!orders || orders.length < 1) {
                console.log(orders.length);
                throw new Error("Merchant Shop doesn't have any orders yet")
            }

            return res.status(200).json({
                status: 'SUCCESS',
                data: orders
            })
        }

    } catch (error) {
        return res.status(400).json({
            status: "FAILED",
            mssg: "error occured: " + error
        })
    }

}



// create function to enable merchants update shops orderstatus
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

            let user = await UserModel.findOne({ _id: order.userId }, "email")
            if (!user) {
                // Handle the case where no user was found with the given _id
                throw new Error("User That own this order was not found.")
            } else {

                userEmailAddr = user.email;

                sendEmail(userEmailAddr, ` Dear User, your order from FoodGrab.africa is ${order.requestStatus} `, "Your Order From FoodGrab.africa");
            }

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