import UserModel from "../../models/User.js";

// API to get all registered users
const getAllUsers = async (req, res) => {
    console.log(req.user._id);
    try {
        const { amount } = req.query;

        if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
            const users = await UserModel.find({}, "-password -__v").sort({ createdAt: -1 });
            res.status(200).json({
                status: "SUCCESS",
                data: users
            });
        } else {
            const limitedUsers = await UserModel.find({}, "-password -__v").limit(Number(amount));
            res.status(200).json({
                status: "SUCCESS",
                data: limitedUsers
            });
        }
    } catch (err) {
        console.error(`Error getting all users : ${err}`);
        res.status(500).json({
            status: "FAILED",
            message: "Server error"
        });
    }
};

// API to get a single user
const getSingleUser = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await UserModel.findById(id, "-password -__v");
        if (user) {
            res.status(200).json({
                status: "SUCCESS",
                data: user
            });
        } else {
            res.status(404).json({
                status: "FAILED",
                message: `No user found with id: ${id}`
            });
        }
    } catch (err) {
        // console.error(`Error getting single user: ${err}`);
        res.status(500).json({
            status: "FAILED",
            message: "Server error"
        });
    }
};

export { getAllUsers, getSingleUser };