import express from "express";
import multer from 'multer';
import courierSignup from "../api/courier/signup.js";
import { requireAuth, secureRoutes } from "../middleware/requrieAuth.js";

const router = express.Router();

const storage = multer.memoryStorage()
const upload = multer({ storage: storage })

// couriers signup
router.post('/signup', upload.array([{ name: 'photo', maxCount: 1 }, { name: 'license', maxCount: 1 }, { name: 'particulars', maxCount: 1 }]), courierSignup);

// authemticate couriers 
router.use(requireAuth)





router.use(secureRoutes) //block users from visited nonexixtent routes

export default router;