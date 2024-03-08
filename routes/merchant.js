import express from "express";
import merchantSignin from "../api/merchant/signin.js";
import merchantSignup from "../api/merchant/signup.js";

const router = express.Router();


// enable merchants to signin
router.post('/signin', merchantSignin);

// enable merchants signup
router.post('/signup', merchantSignup);

export default router;
