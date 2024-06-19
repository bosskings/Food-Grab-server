import ShopModel from "../../models/Shop.js";
import s3PhotoUrl from "../../utils/awsPhotoUrl.js";


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

            const processShops = async () => {
                for (const [key, value] of Object.entries(shops)) {

                    // convert picture names to s3 object urls
                    shops[key].logo = await s3PhotoUrl(value.logo);
                    shops[key].backdropPic = await s3PhotoUrl(value.backdropPic);


                    for (const [key_, value_] of Object.entries(shops[key].cuisines)) {
                        shops[key].cuisines[key_].thumbnail = await s3PhotoUrl(value_.thumbnail)
                    }

                }
            }

            await processShops();


            return res.status(200).json({
                status: "SUCCESS",
                data: shops
            });


        }


    } catch (error) {
        return res.status(404).json({
            status: "FAILED",
            mssg: "shops could not be fetched " + error
        });
    }

};

// get a single shop
const getSingleShop = async (req, res) => {

    try {

        const { id } = req.params;
        const shop = await ShopModel.findById(id).populate('cuisines').exec();


        if (!shop) {
            throw new Error('Shop with provied ID does not exists')
        }

        // convert picture names to s3 object urls
        shop.logo = await s3PhotoUrl(shop.logo);
        shop.backdropPic = await s3PhotoUrl(shop.backdropPic);


        // loop into the cuisines in the shop and add the s3 url
        for (const [index, value] of shop.cuisines.entries()) {
            shop.cuisines[index].thumbnail = await s3PhotoUrl(value.thumbnail);

        }



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