import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import CourierModel from "../../models/Courier.js";

const courierSignup = async (req, res) => {

    try {
        // set up s3 bucket
        const s3 = new S3Client({
            credentials: {
                accessKeyId: process.env.ACCESS_KEY,
                secretAccessKey: process.env.SECRET_KEY
            },
            region: process.env.BUCKET_REGION
        });

        // get user text input
        const {
            firstName, lastName, DOB, NIN,
            phoneNumber, email, password, vehicleType,
            gender, state, street, city, houseNumber
        } = req.body


        // get user file input
        const { files } = req

        let filesToBeStored = {} // get a combination of all uploaded file names;
        for (const file in files) {

            const { buffer } = files[file][0];
            const { fieldname } = files[file][0];
            const { originalname } = files[file][0]
            const { mimetype } = files[file][0]

            let fileExtension = originalname.split('.')[1]; //get file extension
            let randomStr = Date.parse(new Date) //just creates a random string for file names

            // decide where to store the file on s3 bucket depending on user input
            let s3Folder = "";
            if (fieldname == "photo") {
                s3Folder = "riders/photos/"
                filesToBeStored.passportPhoto = s3Folder + randomStr + '.' + fileExtension

            } else if (fieldname == "license") {
                s3Folder = "riders/license/"
                filesToBeStored.driversLicensePhoto = s3Folder + randomStr + '.' + fileExtension

            } else {
                s3Folder = "riders/particulars/"
                filesToBeStored.vehicleParticularsPhoto = s3Folder + randomStr + '.' + fileExtension

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

        // generate url for every image and store it
        // const command = new GetObjectCommand({
        //     Bucket: process.env.BUCKET_NAME,
        //     Key: filesToBeStored.passportPhoto,

        // });
        // const url = await getSignedUrl(s3, command, { expiresIn: 3600 });

        // store in mongodb 
        const ridersDetails = new CourierModel({
            firstName,
            lastName,
            DOB,
            NIN,
            phoneNumber,
            email,
            password,
            vehicleType,
            gender,
            address: {
                state,
                street,
                city,
                houseNumber
            },
            passportPhoto: filesToBeStored.passportPhoto,
            driversLicensePhoto: filesToBeStored.driversLicensePhoto,
            vehicleParticularsPhoto: filesToBeStored.vehicleParticularsPhoto
        })

        const data = await ridersDetails.save()

        if (!data) {
            throw new Error('form datas could not be saved, please reload and try again')
        }


        // send a response to the frontend
        return res.status(201).json({
            status: 'SUCCESS',
            mssg: "Riders details saves successfully",
            data
        })


    } catch (error) {
        return res.status(400).json({
            stauts: 'FAILED',
            mssg: 'error occored' + error
        })
    }

}


// function to send verification email to courier
const sendVerificationEmail = async (req, res) => {

    try {
        const { email } = req.body;
        const { token } = req.body

    } catch (error) {
        return res.status(401).json({
            status: "FAILED",
            mssg: "error occured, " + error
        })
    }

}



export { sendVerificationEmail, courierSignup };