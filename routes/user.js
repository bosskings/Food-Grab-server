import express from "express"
import { signin, verifyCode } from "../api/user/signin.js";
import signup from "../api/user/signup.js";
import { requireAuth, secureRoutes } from "../middleware/requrieAuth.js";
import { placeOrders, viewOrders } from "../api/user/orderItems.js";
import { getCuisines, getSingleCuisine, searchCuisineInShop } from "../api/user/cuisines.js";
import { getShops, getSingleShop } from "../api/user/shops.js";
import { getAllUsers, getSingleUser } from "../api/user/displayUsers.js";
import { sendMessage, getSentMessage } from "../api/user/customerService.js";

const router = express.Router();

// route to sign users in
router.post('/signup', signup);

// verify email
router.post("/verifyEmail", verifyCode);

// route to sign users in
router.post("/signin", signin);

// authentication middleware for all routes excluding signup and signin
router.use(requireAuth);

// get all the users
router.get("/allUsers", getAllUsers);

//get single user
router.get("/singleUser/:id", getSingleUser);

// route to search or get restaurants and private chefs for user
router.get("/shops", getShops);

// get single shop
router.get("/singleShop/:id", getSingleShop);

// route to search and view all dished available 
router.get("/cuisines", getCuisines);

// route to get a single cuisine
router.get("/cuisines/:id", getSingleCuisine);

// route to search for cusisines in a shop
router.get("/searchCuisines", searchCuisineInShop)

// route to take users orders
// process items from cart, store them in DB and show to Merchant
router.post("/checkout", placeOrders);

// endpoint to display all orders
router.get("/viewOrders", viewOrders);

// route to enable users send messages to customer care
router.post("/sendMessage", sendMessage);

// router to recover user password 
router.post("/recoverPassword",)

// get sent messages..
router.get("/sendMessage", getSentMessage)

router.use(secureRoutes) //middleware to avoid nonexistent routes


export default router