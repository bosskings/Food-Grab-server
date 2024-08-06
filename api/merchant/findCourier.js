import OrdersModel from "../../models/Order.js";

// function to find courier for a certain order
const findCourier = async (orderId) => {
    try {

        // get the address of the shop 
        const shop = await OrdersModel.findById(orderId).populate('userId').populate('shopId');

        console.log(shop.shopId.address, '----');
        return
        // find any courier within the shops area


        // when rider accepts, get his details send to the merchant


        //then the rest will be handles on the courier area
    } catch (error) {

        return res.status(500).json({
            status: "FAILED",
            mssg: "unexpected error: " + error
        })

    }

}

export default findCourier