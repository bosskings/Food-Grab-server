import OrdersModel from "../../models/Order.js";


const placeOrders = async (req, res) => {
	try {

		const { shopId, requestNote, deliveryAddress, deliveryCoordinate, items } = req.body

		let totalPrice = 0;

		items.map((item) => {
			totalPrice += item.price * item.quantity;
		})
		let orderItem = new OrdersModel({

			userId: req.user._id,
			shopId, // Assuming shopId is defined somewhere in your code
			totalPrice,
			deliveryCoordinate,
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

		// display orders from a certain user who's id has been parsed in as a query param
		const id = req.user._id

		if (id) {

			// get orders only made  by that specific user and return them if they exist

			let userOrders = await OrdersModel.find({ userId: id }).populate('courier').populate('shopId');

			if (!userOrders || userOrders.length === 0) {
				throw new Error("User does not have any orders");
			}

			return res.status(200).json({
				status: "SUCCESS",
				count: userOrders.length,
				data: userOrders
			})

		}

		const allOrders = await OrdersModel.find({}, "-__v").sort({ createdAt: -1 }).populate('shopId')
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