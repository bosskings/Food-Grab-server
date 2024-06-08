import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import CourierModel from "../../models/Courier.js";
import sendEmail from "../../utils/sendMail.js";
import bcrypt from "bcrypt"


// function to held riders signup
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


        return res.status(200).json(req.body)


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

        // encrypt password
        const salt = await bcrypt.genSalt(10);
        const hashedPass = await bcrypt.hash(password, salt);


        // generate random value for email
        let randomValue = Math.floor(1000 + Math.random() * 9000).toString();
        const salt_ = await bcrypt.genSalt(10);
        let emailVerificationStatus = await bcrypt.hash(randomValue, salt_);

        // send email containing 4 digit code
        let sentEmail = await sendEmail(email, randomValue, "ACCOUNT VERIFICATION")

        if (!sentEmail) {
            throw new Error('email could not be sent, please reload and try again')
        }

        // store in mongodb 
        const ridersDetails = new CourierModel({
            firstName,
            lastName,
            DOB,
            NIN,
            phoneNumber,
            email,
            password: hashedPass,
            vehicleType,
            gender,
            emailVerificationStatus,
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
const verifyEmail = async (req, res) => {
    try {
        // get code and email from form body
        const { email, token } = req.body

        // get token from db to see if its matches current user input
        const user = await CourierModel.findOne({ email })
        if (!user) {
            throw new Error('No user with email ' + email);
        }

        // compare tokens
        let isMatch = await bcrypt.compare(token, user.emailVerificationStatus)
        if (!isMatch) {
            throw new Error('Invalid token')
        }

        // update user email verification status to true
        const result = await CourierModel.findOneAndUpdate({ email }, { emailVerificationStatus: "VERIFIED" }, { new: true });
        if (!result) {
            throw new Error('Email verification failed, please try again')
        }

        return res.status(201).json({
            status: "SUCCESS",
            mssg: "email verified successfully!",
            data: result

        })

    } catch (error) {
        return res.status(400).json({
            stauts: "FAILED",
            mssg: "error occured " + error
        })
    }
}



export { courierSignup, verifyEmail };