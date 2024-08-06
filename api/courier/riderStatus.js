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


// function to collect riders curent location

const currentLocation = async (req, res) => {
    const { lat, long } = req.body;
    const _id = req.user._id;

    try {
        // Update courier with new location
        const update = await CourierModel.findOneAndUpdate(
            { _id },
            { $set: { 'currentLocationCoordinated.lat': lat, 'currentLocationCoordinated.long': long } },
            { new: true }
        );

        res.status(200).json(
            {
                status: "SUCCESS",
                data: update
            }
        )
    } catch (err) {
        res.status(501).json(
            {
                status: "FAILED",
                mssg: "Error occured " + err
            }
        )
    }
};


export {
    courierStatus,
    currentLocation
}