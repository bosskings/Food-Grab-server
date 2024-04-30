import MerchantModel from "../../models/Merchant.js";
import UserModel from "../../models/User.js";


const approveMerchants = async (req, res) => {

    try {

        const { action, merchantId } = req.body

        const merchant = await MerchantModel.findByIdAndUpdate(merchantId, { verificationStatus: action }, { new: true })

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


// function to get all merchants


const getMerchants = async (req, res) => {

    try {

        // Get the list of merchants 
        let merchants = await MerchantModel.find()


        if (!merchants) {
            throw new Error("could not get merchants, please try again ")
        }

        return res.status(200).json({
            status: 'SUCCESS',
            data: merchants
        });

    } catch (error) {

        return res.status(401).json({
            status: 'FAILED',
            mssg: "Error occored " + error
        })
    }

}



// function to get all users


const getUsers = async (req, res) => {

    try {

        // Get the list of merchants 
        let users = await UserModel.find()


        if (!users) {
            throw new Error("could not get users, please try again ")
        }

        return res.status(200).json({
            status: 'SUCCESS',
            data: users
        });

    } catch (error) {

        return res.status(401).json({
            status: 'FAILED',
            mssg: "Error occored " + error
        })
    }

}

export { approveMerchants, getMerchants, getUsers }