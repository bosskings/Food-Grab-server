import CuisineModel from "../../models/Cuisine.js";



const createCuisine = (req, res) => {

    try {
        const { shopId, name, price, description } = req.body;
        if (!name || !price || !description) {
            res.status(400).json({
                status: "FAILED",
                message: 'Missing fields'
            });
        } else {

            // save datas to db
            let newCuisine = new CuisineModel({
                shopId,
                name,
                price,
                description
            });

            newCuisine.save().then((result) => {
                res.status(201).json({
                    status: "SUCCESS",
                    data: result
                })
            })
        }

    } catch (err) {
        res.status(400).json({
            status: "FAILED",
            message: 'Unexpected error, please try again' + err
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