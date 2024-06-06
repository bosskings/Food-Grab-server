import CourierModel from "../../models/Courier.js"

// function to change rider status to offline or online
const status = () => {

    try {
        const ridersId = req.users._id;
        const { body } = req;
        console.log(ridersId, body);
    } catch (error) {

    }
}

export default status