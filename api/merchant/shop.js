import ShopModel from "../../models/Shop.js";

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
            return res.status(201).json({
                status: "SUCCESS",
                data: result
            })
        } else {
            return res.status(401).json({
                status: "FAILED",
                mssg: "Network error, could not create shop."
            })
        }

    } catch (err) {
        return res.status(401).json({
            status: "FAILED",
            mssg: "Unexpected error, please try again." + err
        })
    }


};

export default createShop;