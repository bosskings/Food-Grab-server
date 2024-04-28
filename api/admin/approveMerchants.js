import MerchantModel from "../../models/Merchant.js";


const approveMerchants = async (req, res) => {

    try {

        const { action, _id } = req.body

        const merchant = await MerchantModel.findByIdAndUpdate(_id, { verificationStatus: action }, { new: true })

        if (!merchant) {
            throw new Error("No such Merchant exists!")
        }

        return res.status(200).json({
            status: "SUCCESS",
            data: merchant
        })

    } catch (error) {


        return res.status(501).json({
            status: "FAILED",
            mssg: "An Error occored -- " + error
        })
    }

}

export default approveMerchants