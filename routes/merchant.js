import express from "express";
import multer from 'multer';
import merchantSignin from "../api/merchant/signin.js";
import { merchantSignup, verifyCode } from "../api/merchant/signup.js";
import { createShop, getShop, updateShop } from "../api/merchant/shop.js";
import { requireAuth, secureRoutes } from "../middleware/requrieAuth.js"; //for authentication
import { createCuisine, deleteCuisine, getCuisines, updateCuisine } from "../api/merchant/cuisine.js";
import { createOverview, getOrders, updateOrderStatus } from "../api/merchant/orders.js";
import { dispayMerchantsProfile, updateMerchantsProfile } from "../api/merchant/profile.js";
import { getSentMessage, sendMessage } from "../api/merchant/customerSupport.js";
import { recoverPassword, updatePassword } from "../api/merchant/recoverPass.js";


const router = express.Router();

// to get uploade files
const storage = multer.memoryStorage()
const upload = multer({ storage: storage })


// enable merchants signup
router.post('/signup', merchantSignup);

// verify email
router.post("/verifyEmail", verifyCode);

// enable merchants to signin
router.post('/signin', merchantSignin);

// router to recover user password 
router.post("/recoverPassword", recoverPassword)

// authentication middleware for all routes excluding signup and signin
router.use(requireAuth);

// route to enable user to register a shop
router.post('/createShop', upload.fields([
    { name: 'logo' },
    { name: 'backDrop' }
]), createShop);

// route to update shop details
router.put('/updateShop', updateShop);

// route to view shop created by a particular merchant
router.get('/getShop', getShop)

// route to enable merchants shops create cuisine
router.post('/createCuisine', upload.single('thumbnail'), createCuisine);

// route to get all cuisines made by aa certain merchant
router.get('/getCuisine', getCuisines);

// router to enable merchants update cuisines
router.patch('/updateCuisine/:id', updateCuisine);

// router to delete cuisine
router.delete('/deleteCuisine/:id', deleteCuisine);

// get statistical overview
router.get('/overview', createOverview);

// get order history (same as getting all orders)
router.get('/getOrders', getOrders);

// update order Status
router.patch('/updateStatus/:id', updateOrderStatus);

//route to display merchants profile details
router.get('/getProfile', dispayMerchantsProfile)

// route to update merchants profile
router.patch('/updateProfile', upload.single('picture'), updateMerchantsProfile)

// route to contact support
router.post('/contactSupport', sendMessage)

// route to get send messages
router.get('/getMessages', getSentMessage)

// route to enable Merchants update their passwords
router.patch('/updatePassword', updatePassword)

// get recent transactions
router.get('/transaction',);

router.use(secureRoutes) //middleware to avoid nonexistent routes

export default router;
