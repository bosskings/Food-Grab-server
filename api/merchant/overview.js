import MerchantModel from "../../models/Merchant.js";
import OrdersModel from "../../models/Order.js";

const createOverview = async (req, res) => {

    try {

        //create an object to store different information and give em default values
        let overview = { accountBalance: 0, totalOrders: 0, pendingOrders: 0, successfulOrders: 0 }


        // get shop id belonging to this merchant
        let shopId = await MerchantModel.findById(req.user._id).select('shopId');



        // get account balance from merchants collection
        let balance = await MerchantModel.findById({ shopId }).select('walletBalance');

        if (!balance || balance.length == 0) {
            throw new Error("No merchant found with provided id");
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
            console.log(total);
        }


        // get pending orders




        // get successful orders





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