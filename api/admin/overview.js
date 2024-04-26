import CourierModel from "../../models/Courier.js";
import MerchantModel from "../../models/Merchant.js";
import OrdersModel from "../../models/Order.js"
import UserModel from "../../models/User.js";


// function to get total values
const getTotals = async (req, res) => {
    try {

        // create an object to store all values and store default values
        const overview = { totalOrders: 0, totalUsers: 0, totalMerchants: 0, totalCouriers: 0 }

        // get total orders and push to object
        const orders = await OrdersModel.find({});

        if (orders) {
            overview.totalOrders = orders.length;
        } else {
            throw new Error('Unexpected Error getting orders')
        }


        // get total users

        const users = await UserModel.find({});
        if (users) {
            overview.totalUsers = users.length;
        } else {
            throw new Error('Unexpected Error getting Users')
        }


        // get total Merchants

        const merchants = await MerchantModel.find({});
        if (merchants) {
            overview.totalMerchants = merchants.length;
        } else {
            throw new Error('Unexpected Error getting merchants')
        }


        // get total Couriers

        const couriers = await CourierModel.find({});
        if (couriers) {
            overview.totalCouriers = couriers.length;
        } else {
            throw new Error('Unexpected Error getting Riders')
        }

        return res.status(200).json({
            status: "SUCCESS",
            data: overview
        })

    } catch (error) {

        return res.status(500).json({
            status: "FAILED",
            mssg: "unexpected error " + error
        });
    }
}

export default getTotals