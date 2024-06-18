import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";


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


export default s3PhotoUrl