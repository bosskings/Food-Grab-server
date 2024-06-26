import express from "express";
import multer from 'multer';
import { courierSignup, verifyEmail } from "../api/courier/signup.js";
import { requireAuth, secureRoutes } from "../middleware/requrieAuth.js";
import courierSignin from "../api/courier/signin.js";
import courierStatus from "../api/courier/riderStatus.js";
import { getCouriersProfile } from "../api/courier/profile.js";
import { recoverPassword, updatePassword } from "../api/courier/recoverPass.js";

const router = express.Router();

const storage = multer.memoryStorage()
const upload = multer({ storage: storage })

// couriers signup
router.post('/signup', upload.fields([
    { name: 'photo' },
    { name: 'license' },
    { name: 'particulars' }
]), courierSignup);

// route to verify email
router.post('/verifyEmail', verifyEmail)

// route to signup
router.post('/signin', courierSignin)

// authenticate couriers 
router.use(requireAuth)

// route to update rider status (ONLINE or OFFLINE).
router.patch('/updateStatus', courierStatus);

// router to get couriers profile details
router.get('/getProfile', getCouriersProfile)

// router to recover user password 
router.post("/recoverPassword", recoverPassword)

// authentication middleware for all routes excluding signup and signin
router.use(requireAuth);

// route to enable riders update their passwords
router.patch('/updatePassword', updatePassword)

// route to enable riders accept or decline orders
router.patch('/handleOrders',)



router.use(secureRoutes) //middleware to avoid nonexistent routes










router.use(secureRoutes) //block users from visited nonexixtent routes

export default router;