import express from "express";
import cors from "cors";
import "dotenv/config";

import "./config/db.js"
import router from "./api/user/User.js"

const app = express();
const port = 9000;

// parse JSON bodies
app.use(express.json());

// parse url encoded bodies
app.use(express.urlencoded({ extended: true }))


// use router
app.use('/users/api/v1', router)

app.listen(port, () => {
    console.log(`server running on port ${port}`)
});
