import express from "express";

import "./config/db.js"
import userRoutes from './routes/user.js'

import merchantRoutes from './routes/merchant.js';

import merchantSigninRouter from './api/merchant/signin.js'
import merchantSignupRouter from './api/merchant/signup.js'


import requireAuth from "./middleware/requrieAuth.js";

const app = express();
const port = process.env.PORT || 9000;



// authentication middleware for all routes
app.use(requireAuth);

// parse JSON bodies
app.use(express.json());

// parse url encoded bodies
app.use(express.urlencoded({ extended: true }));

// user router
app.use('/users/api/v1', userRoutes);

//route for merchants
app.use('/merchants/api/v1', merchantRoutes)



// health check for AWS
app.use('/healthCheck', (req, res) => {
    res.status(200).send('Service working well, thank you..........!');
})

app.listen(port, () => {
    console.log(`server running on port ${port}`)
});
