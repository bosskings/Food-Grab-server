import CourierModel from "../../models/Courier.js";
import MerchantModel from "../../models/Merchant.js";
import UserModel from "../../models/User.js";

const suspend = async (req, res) => {

    try {
        const { userType, id, action } = req.body

        // check user type

        if (!userType || !id || !action) {
            throw new Error('all inputes are requried');
        }

        if (userType == "USER") {

            const user = await UserModel.findByIdAndUpdate(id, { isSuspended: true }, { new: true });
            if (!user) {
                throw new Error('Could not find the user')
            }

        } else if (userType == "MERCHANT") {

            const merchant = await MerchantModel.findByIdAndUpdate(id, { isSuspended: true }, { new: true });
            if (!merchant) {
                throw new Error('Could not find the Merchants')
            }

        } else if (userType == "COURIER") {

            const courier = await CourierModel.findByIdAndUpdate(id, { isSuspended: true }, { new: true });
            if (!courier) {
                throw new Error('Could not find the Courier')
            }

        }

    } catch (error) {
        return res.status(400).json({
            status: "FAILED",
            mssg: "Error occored " + error
        })
    }


}

export default suspend