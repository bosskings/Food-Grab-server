import express from "express"
import { signin, verifyCode } from "../api/user/signin.js";
import signup from "../api/user/signup.js";
import requireAuth from "../middleware/requrieAuth.js";
import {
    getCuisines,
    getSignleCousine,
    placeOrders,
    getShops,
    getSingleShop
} from "../api/user/orderItems.js";
import { getAllUsers, getSingleUser } from "../api/user/displayUsers.js";

const router = express.Router();

// route to sign users in
router.post("/signin", signin);

// verify email
router.post("/verifyEmail", verifyCode)

// route to sign users in
router.post('/signup', signup)

// authentication middleware for all routes excluding signup and signin
router.use(requireAuth);

// get all the users
router.get("/allUsers", getAllUsers)

//get single user
router.get("/singleUser/:id", getSingleUser)

// route to get restaurants and private chefs for user
router.get("/shops", getShops);

// get single shop
router.get("/singleShop/:id", getSingleShop)

// route to view all dished available 
router.get("/cuisines", getCuisines);

// route to get a single cuisine
router.get("/cuisines/:id", getSignleCousine)


// route to take users orders
// process items from cart, store them in DB and show to Merchant
router.post("/checkout", placeOrders);

export default router