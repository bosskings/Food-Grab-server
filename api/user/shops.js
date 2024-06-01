import ShopModel from "../../models/Shop.js";
import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

// Function to convert AWS S3 photo object names to URLs
const s3PhotoUrl = async (photo) => {

    // Set up S3 bucket
    const s3 = new S3Client({
        credentials: {
            accessKeyId: process.env.ACCESS_KEY,
            secretAccessKey: process.env.SECRET_KEY
        },
        region: process.env.BUCKET_REGION
    });

    // Generate URL for the image
    const command = new GetObjectCommand({
        Bucket: process.env.BUCKET_NAME,
        Key: photo,
    });

    try {
        const url = await getSignedUrl(s3, command, { expiresIn: 604800 });
        return url;
    } catch (error) {
        return "Error generating signed URL: " + error;
    }
}

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