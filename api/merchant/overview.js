import MerchantModel from "../../models/Merchant.js";
import OrdersModel from "../../models/Order.js";
import ShopModel from "../../models/Shop.js";

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

export default createOverview;