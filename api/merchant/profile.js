import s3PhotoUrl from "../../utils/awsPhotoUrl.js"

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

}


export { dispayMerchantsProfile }