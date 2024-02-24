import express from "express";

import "./config/db.js"
import signupRouter from "./api/user/signup.js"
import signinRouter from "./api/user/signin.js";

const app = express();
const port = process.env.PORT || 9000;

// parse JSON bodies
app.use(express.json());

// parse url encoded bodies
app.use(express.urlencoded({ extended: true }))

// use router
app.use('/users/api/v1/signup', signupRouter)
app.use('/users/api/v1/signin', signinRouter)

// health check
app.use('/healthCheck', (req, res) => {
    res.status(200).send('Service working well, thank you for asking!');
})

app.listen(port, () => {
    console.log(`server running on port ${port}`)
});
