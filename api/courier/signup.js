import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
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


        res.json('file ---> ', req.file)
        console.log('file ---> ', req);


        return;

        // get user input
        const {
            firstName, lastName, DOB, NIN,
            phoneNumber, email, password, vehicleType,
            gender, photo, city, state, street, houseNumber
        } = req.body

        const { buffer } = req.file;
        const { fieldname } = req.file;

        let fileExtension = req.file.originalname.split('.')[1]; //get file extension

        // decide where to store the file on s3 bucket depending on user input
        let s3Folder = "";
        if (fieldname == "photo") {
            s3Folder = "riders/photos/"

        } else if (fieldname == "license") {
            s3Folder = "riders/license/"

        } else {
            s3Folder = "riders/particulars/"
        }


        let randomStr = Date.parse(new Date) //just creates a random string for file names

        // send image buffer to aws s3
        const command = new PutObjectCommand({
            Bucket: process.env.BUCKET_NAME,
            Key: s3Folder + randomStr + '.' + fileExtension,
            Body: buffer,
            ContentType: req.file.mimetype
        });

        console.log(s3Folder, randomStr + '.' + fileExtension);

        await s3.send(command) //send values to s3


        // store in mongodb 

        const ridersRetails = new CourierModel({
            firstName,
            lastName,
            DOB,
            NIN,
            phoneNumber,
            email,
            password,
            vehicleType,
            gender,
            passportPhoto: buffer,
        })


    } catch (error) {
        return res.status(400).json({
            stauts: 'FAILED',
            mssg: "An Error Occured " + error
        })
    }

}

export default courierSignup;