import express from "express";
import merchantSignin from "../api/merchant/signin.js";
import merchantSignup from "../api/merchant/signup.js";
import createShop from "../api/merchant/shop.js";
import { requireAuth, secureRoutes } from "../middleware/requrieAuth.js"; //for authentication
import { createCuisine, deleteCuisine, updateCuisine } from "../api/merchant/cuisine.js";
import createOverview from "../api/merchant/overview.js";


const router = express.Router();


// enable merchants to signin
router.post('/signin', merchantSignin);

// enable merchants signup
router.post('/signup', merchantSignup);


// authentication middleware for all routes excluding signup and signin
router.use(requireAuth);
// router.use(secureRoutes) //middleware to avoid nonexistent routes

// route to enable user to register a shop
router.post('/createShop', createShop);

// route to enable merchants shops create cuisin
router.post('/createCuisine', createCuisine);

// router to enable merchants update cuisines
router.patch('/updateCuisine', updateCuisine);

// router to delete cuisine
router.post('/deleteCuisine', deleteCuisine);

// get statistical overview
router.get('/overview', createOverview);


// get order history
router.get('/getOrders',);

// update order Status
router.post('/orderStatus',);

// update cuisine availability Status
router.post('/cuisineStatus',);

// get recent transactions
router.get('/transaction',);



export default router;
