import ShopModel from "../../models/Shop.js";

// display all shops
const getShops = async (req, res) => {
    try {
        //find out the amount of shops need from query param
        const { amount, search } = req.query;


        if (amount && Number(amount) > 0) {

            const shops = await ShopModel.find({}, "-__v").limit(Number(amount)).sort({ createdAt: -1 }).populate('cuisines').exec();
            return res.status(200).json({
                status: "SUCCESS",
                data: shops
            });

        } else if (search) {

            const shops = await ShopModel.find({ shopName: { $regex: search, $options: 'i' } }).sort({ createdAt: -1 }).populate('cuisines');

            if (!shops) {
                throw new Error("No shops found, please check spelling and try again")
            }
            return res.status(200).json({
                status: "SUCCESS",
                data: shops
            });

        } else {

            const shops = await ShopModel.find({}, "-__v").sort({ createdAt: -1 }).populate('cuisines').exec();
            return res.status(200).json({
                status: "SUCCESS",
                data: shops
            });

        }

    } catch (error) {
        return res.status(404).json({
            status: "FAILED",
            mssg: "shops could not be fetched"
        });
    }

};

// get a single shop
const getSingleShop = async (req, res) => {

    try {

        const { id } = req.params;
        const shop = await ShopModel.findById(id).populate('cuisines').exec();
        return res.status(200).json({
            status: 'SUCCESS',
            data: shop
        });


    } catch (error) {
        return res.status(404).json({
            status: 'FAILED',
            mssg: error
        })
    }

};





export {
    getShops,
    getSingleShop
}