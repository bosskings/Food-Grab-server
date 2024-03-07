import express from "express";

import "./config/db.js"
import signupRouter from "./api/user/signup.js"
import signinRouter from "./api/user/signin.js";
import { allUsersRouter, singleUserRouter } from "./api/user/displayUsers.js"

import merchantSigninRouter from './api/merchant/signin.js'
import merchantSignupRouter from './api/merchant/signup.js'

import { shopsRouter, cuisinesRouter, ordersRouter } from "./api/user/orderItems.js"

import requireAuth from "./middleware/requrieAuth.js";

const app = express();
const port = process.env.PORT || 9000;



// authentication middleware for all routes
// app.use(requireAuth);

// parse JSON bodies
app.use(express.json());

// parse url encoded bodies
app.use(express.urlencoded({ extended: true }));

// user router
app.use('/users/api/v1/signup', signupRouter);
app.use('/users/api/v1/signin', signinRouter);

app.use('/users/api/v1/allUsers', allUsersRouter); //get all users
app.use('/users/api/v1/singleUser', singleUserRouter); //get single user

app.use('/users/api/v1/shops', shopsRouter); // shops from both categories(restaurants & chefs) based on a query param
app.use('/users/api/v1/cuisines', cuisinesRouter); //get all the cuisines offered by a shop.
app.use('/users/api,v1/checkout', ordersRouter); // prcoess items from cart, store them in DB and show to Merchant


//route for merchants
app.use('/merchants/api/v1/singup', merchantSignupRouter)
app.use('/merchants/api/v1/singup', merchantSigninRouter)




// health check for AWS
app.use('/healthCheck', (req, res) => {
    res.status(200).send('Service working well, thank you!');
})

app.listen(port, () => {
    console.log(`server running on port ${port}`)
});
