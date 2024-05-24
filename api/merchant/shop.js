import MerchantModel from "../../models/Merchant.js";
import ShopModel from "../../models/Shop.js";
import sendEmail from "../../utils/sendMail.js";

const createShop = async (req, res) => {
    try {
        // console.log(req.user._id);

        // check if a shop  already exists for the user
        const existing_shop = await ShopModel.findOne({ merchantId: req.user._id });
        if (existing_shop) throw new Error("You have already created a shop.");


        const { shopName, address, description, type, logo, backdropPic } = req.body;

        const newShop = await ShopModel({

            merchantId: req.user._id, // hardcoded for now as we don't
            shopName,
            address,
            description,
            approvalStatus: "PENDING",
            type,
            logo,
            backdropPic
        });

        const result = await newShop.save();
        if (result) {

            // update merchants to contain new shop Id.
            let updatedMerchants = await MerchantModel.findOneAndUpdate({ _id: req.user._id }, { shopId: result._id }, { new: true })


            if (!updatedMerchants) {
                throw new Error('Unexpected error occored, please try again')
            }

            // send email
            sendEmail(updatedMerchants.email, ` Dear User, your Shop ${shopName} at FoodGrab.africa has been create`, "FoodGrab.africa");

            return res.status(201).json({
                status: "SUCCESS",
                data: result
            })
        } else {
            throw new Error("Network error, could not create shop.")
        }

    } catch (err) {
        return res.status(401).json({
            status: "FAILED",
            mssg: "Unexpected error, please try again." + err
        })
    }


};


// function to display shop
const getShop = async (req, res) => {
    try {

        // use the users logged in ID to search for shops matching that ID
        let { userType } = req.user;
        const merchantId = req.user._id;

        if (userType != "MERCHANT") {
            throw new Error("Wrong Access, please login as a merchant")
        }

        // find shop with ID gotten
        let shop = await ShopModel.findOne({ merchantId }).populate('cuisines').exec();
        if (!shop) {
            throw new Error("No shop was found for this merchant")
        }

        return res.status(200).json({
            status: "SUCCESS",
            data: shop
        })

    } catch (error) {

        res.status(500).json({
            status: "FAILED",
            mssg: "An error occored, " + error
        })

    }
}

export { createShop, getShop };