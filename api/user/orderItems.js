import OrdersModel from "../../models/Order.js";


const placeOrders = async (req, res) => {
	try {

		const { shopId, requestNote, deliveryAddress, items } = req.body

		let totalPrice = 0;

		items.map((item) => {
			totalPrice += item.price * item.quantity;
		})
		let orderItem = new OrdersModel({

			userId: req.user._id,
			shopId, // Assuming shopId is defined somewhere in your code
			totalPrice,
			deliveryAddress,
			requestNote, // Assuming requestNote is defined somewhere in your code
			items
		});

		let result = await orderItem.save();

		if (result) {

			// update the order request status to PROCESSING
			let updated = await OrdersModel.findByIdAndUpdate(result._id, { requestStatus: 'PROCESSING' }, { new: true })

			if (updated) {

				return res.status(201).json({
					status: "SUCCESS",
					mssg: `${items.length} number of Orders Placed Successfully!`,
					data: updated
				});
			}

		} else {
			return res.status(400).json({
				status: "FAILED",
				message: "No orders were placed, Please try again."
			});
		}
	} catch (err) {
		return res.status(500).json({
			status: 'FAILED',
			mssg: `Unexpected Server Error. Please try again. ${err + req.user}`
		});
	}
};

// function to view all orders

const viewOrders = async (req, res) => {

	try {
		const allOrders = await OrdersModel.find({}, "-__v").sort({ createdAt: -1 })
		if (!allOrders) {
			throw new Error("No orders found")
		} else {
			return res.status(201).json({
				status: "SUCCESS",
				data: allOrders
			})
		}

	} catch (error) {
		return res.status(404).json({
			status: "FAILED",
			mssg: "Error Occured, " + error
		})
	}
}


export {
	placeOrders,
	viewOrders
}