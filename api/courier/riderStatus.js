import CourierModel from "../../models/Courier.js"

// function to change rider status to offline or online
const courierStatus = async (req, res) => {

    try {
        const ridersId = req.user._id;
        const { body } = req;

        // update courier document with said id with inputed body
        const newData = await CourierModel.findByIdAndUpdate(ridersId, body, { new: true })

        if (!newData) {
            throw new Error("could not update status, please try again")
        }

        return res.status(200).json({
            status: "SUCCESS",
            mssg: "status updated success ",
            data: newData
        })
    } catch (error) {

        return res.status(501).json({
            status: "FAILED",
            mssg: "Error occured " + error
        })
    }
}

export default courierStatus