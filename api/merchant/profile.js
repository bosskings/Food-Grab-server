import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import s3PhotoUrl from "../../utils/awsPhotoUrl.js"
import MerchantModel from "../../models/Merchant.js";

//function to display merchants profile
const dispayMerchantsProfile = async (req, res) => {

    // convert picture to s3url and send to response when default pic is not being used
    if (req.user.pictureAddress != "https://food-grab-images.s3.amazonaws.com/merchants/avatar.gif") {

        req.user.pictureAddress = await s3PhotoUrl(req.user.pictureAddress);
    }

    return res.status(200).json({
        status: "SUCCESS",
        data: req.user
    })

}


// function to update merchants profile
const updateMerchantsProfile = async (req, res) => {

    try {

        // check if a picture was provided
        if (req.file) {

            // get file properties
            const { buffer } = req.file;
            const { originalname } = req.file;
            const { mimetype } = req.file;

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

            const storeLocation = 'merchants/' + randomStr + '.' + fileExtension

            // send image buffer to aws s3
            const command = new PutObjectCommand({
                Bucket: process.env.BUCKET_NAME,
                Key: storeLocation,
                Body: buffer,
                ContentType: mimetype
            });

            await s3.send(command) //send values to s3

            // attach picture location to request body
            req.body.pictureAddress = storeLocation;
        }

        // update merchants data.
        let result = await MerchantModel.findOneAndUpdate({ _id: req.user._id }, req.body, { new: true })


        if (!result) {
            throw new Error("Could not update merchant, please try later")
        }

        return res.status(200).json({
            status: 'SUCCESS',
            mssg: "details updated successfully",
            data: result
        })

    } catch (error) {
        return res.status(500).json({
            status: "FAILED",
            mssg: 'Error occured: ' + error
        })
    }

}


export { dispayMerchantsProfile, updateMerchantsProfile }