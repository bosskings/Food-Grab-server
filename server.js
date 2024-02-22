import express from "express";

import "./config/db.js"
import signupRouter from "./api/user/signup.js"
import signinRouter from "./api/user/signin.js";

const app = express();
const port = 9000;

// parse JSON bodies
app.use(express.json());

// parse url encoded bodies
app.use(express.urlencoded({ extended: true }))

// use router
app.use('/users/api/v1/signup', signupRouter)
app.use('/users/api/v1/signin', signinRouter)

app.listen(port, () => {
    console.log(`server running on port ${port}`)
});
