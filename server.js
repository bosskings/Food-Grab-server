import "./config/db.js"
import express from "express";
import userRoutes from './routes/user.js'
import merchantRoutes from './routes/merchant.js';
import sendEmail from "./utils/sendMail.js";
import cors from "cors";

const app = express();
const port = process.env.PORT || 9000;

// parse JSON bodies
app.use(express.json());

// parse url encoded bodies
app.use(express.urlencoded({ extended: true }));

// Enable CORS for all routes
app.use(cors());

// user router
app.use('/users/api/v1', userRoutes);

//route for merchants
app.use('/merchants/api/v1', merchantRoutes)


app.use('/test', sendEmail)

// health check for AWS
app.use('/healthCheck', (req, res) => {
    res.status(200).send('Service working well, thank you..........!');
})

app.listen(port, () => {
    console.log(`server running on port ${port}`)
});
