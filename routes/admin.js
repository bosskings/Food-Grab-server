import express from "express";
import adminSignin from "../api/admin/signin.js";
import { requireAuth } from "../middleware/requrieAuth.js";
import getTotals from "../api/admin/overview.js";
import approveMerchants from "../api/admin/approveMerchants.js";


// this file would display  the data from a database for an admin to see and manage..


const router = express.Router()

// enable admin sigin
router.post("/signin", adminSignin);


// authenticate
router.use(requireAuth);

//get totals overview
router.get('/getTotals', getTotals);


// approve merchants
router.patch('/approveMerchants', approveMerchants);








export default router