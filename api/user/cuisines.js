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

            const cuisines = await CuisineModel.find({ name: { $regex: search, $options: 'i' } });
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
const getSingleCuisine = async (req, res) => {
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



// seearch for for cuisines in a particular shop
const searchCuisineInShop = async (req, res) => {

    // collect shopId and search term from user

    const { search, shopId } = req.query

    try {

        // search for cuisines with the provided shopId
        let results = await CuisineModel.find({
            name: { $regex: search, $options: 'i' }, // Case-insensitive search
            shopId
        });

        if (results.length == 0) {
            throw new Error("could not find any result")
        }
        return res.status(200).json({
            status: "SUCCESS",
            data: results
        })
    } catch (error) {
        return res.status(500).json({
            status: "FAILED",
            mssg: "An error occored " + error.message
        })
    }
}


export {
    getCuisines,
    getSingleCuisine,
    searchCuisineInShop
}