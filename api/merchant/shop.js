import MerchantModel from "../../models/Merchant.js";
import ShopModel from "../../models/Shop.js";
import sendEmail from "../../utils/sendMail.js";
import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
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
        return "Error generating signed URL:" + error;
    }
}


// function to create a shop

const createShop = async (req, res) => {
    try {
        // console.log(req.user._id);

        // check if a shop  already exists for the user
        const existing_shop = await ShopModel.findOne({ merchantId: req.user._id });
        if (existing_shop) {
            throw new Error("You have already created a shop.");
        }

        // get user input
        const { shopName, street, city, state, houseNumber, description, type } = req.body;

        // set up s3 bucket
        const s3 = new S3Client({
            credentials: {
                accessKeyId: process.env.ACCESS_KEY,
                secretAccessKey: process.env.SECRET_KEY
            },
            region: process.env.BUCKET_REGION
        });


        const { files } = req

        let filesToBeStored = {} // get a combination of all uploaded file names;
        for (const file in files) {

            const { buffer } = files[file][0];
            const { fieldname } = files[file][0];
            const { originalname } = files[file][0];
            const { mimetype } = files[file][0];

            let fileExtension = originalname.slice((originalname.lastIndexOf(".") - 1 >>> 0) + 2).toLowerCase(); //get file extension

            // make sure file extension is for picture file
            if (fileExtension !== 'jpg' && fileExtension !== 'png' && fileExtension !== 'jpeg', fileExtension !== 'gif') {
                throw new Error("Only jpg, png, jpeg picture files allowed")
            }

            let randomStr = Date.parse(new Date) //just creates a random string for file names


            // decide where to store the file on s3 bucket depending on user input
            let s3Folder = "";
            if (fieldname == "logo") {
                s3Folder = "shops/logo/"
                filesToBeStored.logo = s3Folder + randomStr + '.' + fileExtension

            } else if (fieldname == "backDrop") {
                s3Folder = "shops/backDrop/"
                filesToBeStored.backDrop = s3Folder + randomStr + '.' + fileExtension

            }

            // send image buffer to aws s3
            const command = new PutObjectCommand({
                Bucket: process.env.BUCKET_NAME,
                Key: s3Folder + randomStr + '.' + fileExtension,
                Body: buffer,
                ContentType: mimetype
            });

            await s3.send(command) //send values to s3
        }


        const newShop = await ShopModel({

            merchantId: req.user._id, // hardcoded for now as we don't
            shopName,
            address: {
                street,
                city,
                state,
                houseNumber
            },
            description,
            approvalStatus: "PENDING",
            type,
            logo: filesToBeStored.logo,
            backdropPic: filesToBeStored.backDrop
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

        // convert picture names to s3 object urls
        shop.logo = await s3PhotoUrl(shop.logo);
        shop.backdropPic = await s3PhotoUrl(shop.backdropPic);

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


// create function to update shop details like shop status e.t.c
const updateShop = async (req, res) => {

    try {
        // get the shop ID from the loggedin user details
        const shopId = req.user.shopId;

        if (!shopId) {
            throw new Error("No shop was found for this merchant")
        }

        // update shopModel with user input
        const result = await ShopModel.findByIdAndUpdate(shopId, req.body, { new: true })

        res.status(200).json({
            status: "SUCCESS",
            data: result
        })

    } catch (error) {
        res.status(200).json({
            status: "FAILED",
            mssg: "an error occured " + error
        })
    }
}
export { createShop, getShop, updateShop };