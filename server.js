import express from "express";

import "./config/db.js"
import signupRouter from "./api/user/signup.js"
import signinRouter from "./api/user/signin.js";
import { allUsersRouter, singleUserRouter } from "./api/user/displayUsers.js"

const app = express();
const port = process.env.PORT || 9000;

// parse JSON bodies
app.use(express.json());

// parse url encoded bodies
app.use(express.urlencoded({ extended: true }));

// use router
app.use('/users/api/v1/signup', signupRouter);
app.use('/users/api/v1/signin', signinRouter);

// api to get all users
app.use('/users/api/v1/allUsers', allUsersRouter);
// api to get  a user by id
app.use('/users/api/v1/singleUser', singleUserRouter);

// health check for AWS
app.use('/healthCheck', (req, res) => {
    res.status(200).send('Service working well, thank you!');
})

app.listen(port, () => {
    console.log(`server running on port ${port}`)
});
