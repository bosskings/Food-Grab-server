import express from "express";
import merchantSignin from "../api/merchant/signin.js";
import merchantSignup from "../api/merchant/signup.js";
import createShop from "../api/merchant/shop.js";
import requireAuth from "../middleware/requrieAuth.js"; //for authentication
import { createCuisine, deleteCuisine, updateCuisine } from "../api/merchant/cuisine.js";


const router = express.Router();


// enable merchants to signin
router.post('/signin', merchantSignin);

// enable merchants signup
router.post('/signup', merchantSignup);


// authentication middleware for all routes excluding signup and signin
router.use(requireAuth);

// route to enable user to register a shop
router.post('/createShop', createShop);

// route to enable merchants shops create cuisin
router.post('/createCuisine', createCuisine);

// router to enable merchants update cuisines
router.post('/updateCuisine', updateCuisine);

// router to delete cuisine
router.post('/deleteCuisine', deleteCuisine);



export default router;
