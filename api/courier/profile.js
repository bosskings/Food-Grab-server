import s3PhotoUrl from "../../utils/awsPhotoUrl.js"


//create a function to get riders profile
const getCouriersProfile = async (req, res) => {

    try {

        req.user.passportPhoto = await s3PhotoUrl(req.user.passportPhoto);
        req.user.driversLicensePhoto = await s3PhotoUrl(req.user.driversLicensePhoto);
        req.user.vehicleParticularsPhoto = await s3PhotoUrl(req.user.vehicleParticularsPhoto);

        return res.status(200).json({
            status: "SUCCESS",
            data: req.user
        })
    } catch (error) {
        return res.status(200).json({
            status: "FAILED",
            mssg: "an error occured: " + error
        })
    }


}

export { getCouriersProfile }