import "./config/db.js"
import express from "express";
import userRoutes from './routes/user.js'
import merchantRoutes from './routes/merchant.js';

const app = express();
const port = process.env.PORT || 9000;

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
