import CuisineModel from "../../models/Courier.js";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

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


        // get user input
        const {
            firstName, lastName, DOB, NIN,
            phoneNumber, email, password, vehicleType,
            gender, photo, city, state, street, houseNumber
        } = req.body

        const { buffer } = req.file


        // send image buffer to aws s3
        const command = new PutObjectCommand({
            Bucket: process.env.BUCKET_NAME,
            Key: "riders/photos/" + req.file.originalname,
            Body: buffer,
            ContentType: req.file.mimetype
        });

        await s3.send(command) //send values to s3

        console.log(req.file)



    } catch (error) {
        return res.status(400).json({
            stauts: 'FAILED',
            mssg: "An Error Occured " + error
        })
    }

}

export default courierSignup;