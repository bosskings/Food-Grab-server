import express from "express";
import UserModel from "../../models/User.js";

const allUsersRouter = express.Router();
const singleUserRouter = express.Router();

// API to get all registered users
allUsersRouter.get("/", (req, res) => {
    // check if the amount is provided, number and not negative or zero
    const { amount } = req.query;
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
        // return all user in DB
        UserModel.find({}, "-password -__v")
            .sort({ createdAt: -1 })
            .then((users) => {
                res.status(200).json({
                    status: "SUCCESS",
                    data: users
                });
            })
            .catch((err) => {
                console.log(`Error getting all users : ${err}`);
                res.status(400).send({
                    status: "FAILED",
                    mssg: "Server error"
                });
            });

    } else {
        // return the amount of users specified in URL params
        UserModel.find({}, "-password -__v").limit(10).then((users) => {
            res.status(200).json({
                status: "SUCCESS",
                data: users
            });
        }).catch((err) => {
            res.status(400).send({
                status: "FAILED",
                mssg: "Server error"
            });
        });
    }

});



// API to get single users
singleUserRouter.get("/:id", async (req, res) => {
    const { id } = req.params;

    UserModel.findById(id, "-password -__v").then((users) => {
        res.status(200).json({
            status: "SUCCESS",
            data: users
        });
    }).catch((err) => {
        res.status(400).send({
            status: "FAILED",
            mssg: `No user with id:${id}`
        });
    });
});



export { allUsersRouter, singleUserRouter };