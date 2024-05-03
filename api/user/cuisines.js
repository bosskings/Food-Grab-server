import CuisineModel from "../../models/Cuisine.js";

const getCuisines = async (req, res) => {

    try {
        //find out the name or amount of cuisines needed from query param
        const { amount, search } = req.query;
        if (amount && Number(amount) && amount > 0) {

            const cuisines = await CuisineModel.find({}, "-__v").limit(Number(amount)).sort({ createdAt: -1 });
            return res.status(200).json({
                status: "SUCCESS.",
                data: cuisines
            });

        } else if (search) {

            const cuisines = await CuisineModel.find({}, "-__v").sort(search);
            return res.status(200).json({
                status: "SUCCESS..",
                data: cuisines
            });

        } else {

            const cuisines = await CuisineModel.find({}, "-__v").sort({ createdAt: -1 });
            return res.status(200).json({
                status: "SUCCESS...",
                data: cuisines
            });

        }

    } catch (error) {
        return res.status(404).json({
            status: "FAILED",
            data: "Dish could not be fetched"
        });
    }
};



// get a single cuisine
const getSingleCousine = async (req, res) => {
    // fetch a single item based on id

    try {
        const { _id } = req.params;
        const cousine = await CuisineModel.findById({ _id })
        if (!cousine) {
            return res.status(404).json({
                status: 'FAILED',
                message: `No cuisine with the id of ${_id}`
            });

        } else {
            return res.status(200).json({
                status: 'SUCCESS',
                data: cousine
            });
        }
    } catch (error) {
        return res.status(404).json({
            status: 'FAILED',
            message: `Network Error Please try again`
        });
    }

};


export {
    getCuisines,
    getSingleCousine
}