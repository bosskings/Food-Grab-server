import "./config/db.js"
import express from "express";
import userRoutes from './routes/user.js'
import merchantRoutes from './routes/merchant.js';
import courierRoutes from './routes/courier.js';
import adminRoutes from './routes/admin.js';
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

//route for couriers
app.use('/couriers/api/v1', courierRoutes)

// route for admins to handle business
app.use('/admin/api/v1', adminRoutes)

// health check for AWS
app.use('/healthCheck', (req, res) => {
    res.status(200).send('Service working well, thank you..........!');
})

app.listen(port, () => {
    console.log(`server running on port ${port}`)
});
