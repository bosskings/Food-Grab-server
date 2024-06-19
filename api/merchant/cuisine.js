import CuisineModel from "../../models/Cuisine.js";
import ShopModel from "../../models/Shop.js";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import s3PhotoUrl from "../../utils/awsPhotoUrl.js";


// function to create cuisines
const createCuisine = async (req, res) => {

    try {

        const { name, price, description } = req.body;
        // get file properties
        const { buffer } = req.file;
        const { originalname } = req.file;
        const { mimetype } = req.file;
        const shopId = req.user.shopId


        if (!name || !price || !description) {
            throw new Error('All fields requried')
        }

        // set up s3 bucket
        const s3 = new S3Client({
            credentials: {
                accessKeyId: process.env.ACCESS_KEY,
                secretAccessKey: process.env.SECRET_KEY
            },
            region: process.env.BUCKET_REGION
        });


        let fileExtension = originalname.slice((originalname.lastIndexOf(".") - 1 >>> 0) + 2).toLowerCase(); //get file extension


        // make sure file extension is for picture file
        if (fileExtension !== 'jpg' && fileExtension !== 'png' && fileExtension !== 'jpeg' && fileExtension !== 'gif') {
            throw new Error("Only jpg, png, jpeg picture files allowed")
        }

        let randomStr = Date.parse(new Date) //just creates a random string for file names

        const storeLocation = 'cuisines/' + randomStr + '.' + fileExtension

        // send image buffer to aws s3
        const command = new PutObjectCommand({
            Bucket: process.env.BUCKET_NAME,
            Key: storeLocation,
            Body: buffer,
            ContentType: mimetype
        });

        await s3.send(command) //send values to s3


        let newCuisine = new CuisineModel({
            shopId,
            name,
            price,
            description,
            thumbnail: storeLocation
        });

        newCuisine.save().then((result) => {

            // Get referenced shop and update the ID of this cuisine in the shop
            ShopModel.findById(shopId).then((shop) => {
                shop.cuisines.push(result._id);
                return shop.save();
            }).then(() => {
                res.status(201).json({
                    status: "SUCCESS",
                    data: result
                });
            }).catch((err) => {
                res.status(500).json({
                    status: "FAILED",
                    mssg: "Could not save cuisine to a shop: " + err
                });
            });
        }).catch((err) => {
            res.status(500).json({
                status: "FAILED",
                mssg: "Could not save cuisine: " + err
            });
        });

    } catch (err) {
        res.status(500).json({
            status: "FAILED",
            mssg: 'Unexpected error, please try again: ' + err
        });
    }
};

// function to get all cuisines by logged in merchant
const getCuisines = async (req, res) => {

    try {

        //get ID or logged in merchant
        const shopId = req.user.shopId

        // get all cuisines with shop Id from the merchant
        let cuisines = await CuisineModel.find({ shopId });

        if (!cuisines || cuisines.length < 1) {
            throw new Error('No cuisines found for this merchants');
        }

        // inject the s3 url into all cuisines gotten from mongodb
        for (let index = 0; index < cuisines.length; index++) {
            cuisines[index].thumbnail = await s3PhotoUrl(cuisines[index].thumbnail);
        }

        // await s3PhotoUrl(items.thumbnail);

        res.status(200).json({
            status: "SUCCESS",
            data: cuisines
        })

    } catch (error) {

        res.status(400).json({
            status: "FAILED",
            mssg: "an error occured " + error
        })
    }

}

// function to update cuisine
const updateCuisine = async (req, res) => {

    try {

        const id = req.params.id; //get cuisine id

        // patch object with specified id
        let update = await CuisineModel.findByIdAndUpdate(id, req.body, { new: true });

        if (!update) { //incase of errors
            throw new Error("Cuisine not found");
        }

        res.status(200).json({
            status: "SUCCESS",
            data: update
        })
    } catch (error) {
        res.status(500).json({
            status: "FAILED",
            mssg: "Unexpected error " + error
        })
    }


};


const deleteCuisine = async (req, res) => {

    try {

        const id = req.params.id; //get cuisine id

        // delete object with specified id
        let deleted = await CuisineModel.findByIdAndDelete(id);

        if (!deleted) { //incase of errors

            res.status(500).json({
                status: "FAILED",
                mssg: "Cuisine not found"
            })
        }

        res.status(200).json({
            status: "SUCCESS",
            mssg: "cuisine deleted",
            data: deleted
        })
    } catch (error) {
        res.status(500).json({
            status: "FAILED",
            mssg: "Unexpected error " + error
        })
    }
};

export {
    createCuisine,
    getCuisines,
    updateCuisine,
    deleteCuisine
};