import express from "express";
import multer from 'multer';
import { courierSignup, verifyEmail } from "../api/courier/signup.js";
import { requireAuth, secureRoutes } from "../middleware/requrieAuth.js";

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


// route  to signup


// authenticate couriers 
router.use(requireAuth)








router.use(secureRoutes) //block users from visited nonexixtent routes

export default router;