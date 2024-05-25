import CuisineModel from "../../models/Cuisine.js";
import ShopModel from "../../models/Shop.js";



const createCuisine = async (req, res) => {


    try {

        const { name, price, description, thumbnail } = req.body;
        const shopId = req.user.shopId
        if (!name || !price || !description) {
            return res.status(400).json({
                status: "FAILED",
                message: 'Missing fields'
            });
        }

        let newCuisine = new CuisineModel({
            shopId,
            name,
            price,
            description,
            thumbnail
        });

        newCuisine.save().then((result) => {


            // Get referenced shop and update the ID of this cuisine in the shop
            ShopModel.findById(shopId).then((shop) => {
                shop.cuisines.push(result._id);
                return shop.save();
            }).then(() => {
                res.status(201).json({
                    status: "SUCCESS",
                    data: result
                });
            }).catch((err) => {
                res.status(500).json({
                    status: "FAILED",
                    mssg: "Could not save cuisine to a shop: " + err
                });
            });
        }).catch((err) => {
            res.status(500).json({
                status: "FAILED",
                mssg: "Could not save cuisine: " + err
            });
        });

    } catch (err) {
        res.status(500).json({
            status: "FAILED",
            mssg: 'Unexpected error, please try again: ' + err
        });
    }
};

// function to get all cuisines by logged in merchant
const getCuisines = async (req, res) => {

    try {

        //get ID or logged in merchant
        const shopId = req.user.shopId

        // get all cuisines with shop Id from the merchant
        const cuisines = await CuisineModel.find({ shopId });

        if (!cuisines) {
            throw new Error('No cuisines found for this merchants');
        }

        res.status(200).json({
            status: "SUCCESS",
            data: cuisines
        })

    } catch (error) {

        res.status(400).json({
            status: "FAILED",
            mssg: "an error occured " + error
        })
    }

}

// function to update cuisine
const updateCuisine = async (req, res) => {

    try {

        const id = req.params.id; //get cuisine id

        // patch object with specified id
        let update = await CuisineModel.findByIdAndUpdate(id, req.body, { new: true });

        if (!update) { //incase of errors
            throw new Error("Cuisine not found");
        }

        res.status(200).json({
            status: "SUCCESS",
            data: update
        })
    } catch (error) {
        res.status(500).json({
            status: "FAILED",
            mssg: "Unexpected error " + error
        })
    }


};


const deleteCuisine = async (req, res) => {

    try {

        const id = req.params.id; //get cuisine id

        // delete object with specified id
        let deleted = await CuisineModel.findByIdAndDelete(id);

        if (!deleted) { //incase of errors

            res.status(500).json({
                status: "FAILED",
                mssg: "Cuisine not found"
            })
        }

        res.status(200).json({
            status: "SUCCESS",
            data: deleted
        })
    } catch (error) {
        res.status(500).json({
            status: "FAILED",
            mssg: "Unexpected error " + error
        })
    }
};

export {
    createCuisine,
    getCuisines,
    updateCuisine,
    deleteCuisine
};