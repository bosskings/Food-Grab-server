import CuisineModel from "../../models/Cuisine.js";
import ShopModel from "../../models/Shop.js";



const createCuisine = (req, res) => {
    try {
        const { shopId, name, price, description, thumbnail } = req.body;
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
                    message: "Could not save cuisine to a shop: " + err
                });
            });
        }).catch((err) => {
            res.status(500).json({
                status: "FAILED",
                message: "Could not save cuisine: " + err
            });
        });

    } catch (err) {
        res.status(500).json({
            status: "FAILED",
            message: 'Unexpected error, please try again: ' + err
        });
    }
};


const updateCuisine = (req, res) => {

};


const deleteCuisine = (req, res) => {

};

export {
    createCuisine,
    updateCuisine,
    deleteCuisine
};