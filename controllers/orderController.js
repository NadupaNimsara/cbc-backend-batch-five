import Order from "../models/order.js"
import Product from "../models/product.js"


export async function createOrder(req,res){
    if(req.user == null){
        res.status(403).json({
            message : "Please login and try again"
        })
        return
    }

    const orderinfo = req.body

    if (orderinfo.name == null){
        orderinfo.name = req.user.firstName + " " + req.user.lastName
    }


    let orderId = "CBC00001"

    const lastOrder = await Order.find().sort({date : -1}).limit(1)

    if(lastOrder.length > 0){
        const lastOrderId = lastOrder[0].orderId  //"CBC00551"

        const lastOrderNumberString = lastOrderId.replace("CBC","") //"00551"
        const lastOrderNumber = parseInt(lastOrderNumberString) //551
        const newOrderNumber = lastOrderNumber + 1  //552
        const newOrderNumberString = String(newOrderNumber).padStart(5, '0');
        orderId = "CBC"+newOrderNumberString //CBC0055
    }
    


    try{

        let total = 0;
        let labelledTotal = 0;
        const products = []

        for(let i =0; i<orderinfo.products.length; i++){
            const item  = await Product.findOne({productId : orderinfo.products[i].productId})  //user ගේ order එකේ දාපු productId එකට සමාන product එක MongoDB එකේ තිබ්බොත් එය item variable එකට assign වෙනවා. 

            if(item == null){
                res.status(404).json({
                    message : "Product with productId" + orderinfo.products[i].productId + "not found",
                })
                return
            }

            if(item.isAvalabale == false){
                res.status(404).json({
                    message : "Product with productId" + orderinfo.products[i].productId + "is not avalabel",
                })
                return
            }
            products[i] = {
                productInfo : {
                    ProductId : item.productId,
                    name : item.name,
                    altNames :  item.altName,
                    description : item.description,
                    images : item.images,
                    labelledPrice : item.labelledPrice,
                    price : item.price
                },
                quantity : orderinfo.products[i].quantity
            }
            //total = total * orderinfo.products[i].quantity
            total += (item.price * orderinfo.products[i].quantity)

            labelledTotal += (item.labelledPrice * orderinfo.products[i].quantity)
        }
       
    const order = new Order({
        orderId : orderId,
        email : req.user.email,
        name : orderinfo.name,
        address : orderinfo.address,
        phone : orderinfo.phone,
        total : 0,
        products : products,
        labelledTotal : labelledTotal,
        total : total,
    })

        const createdOrder = await order.save()
        res.json({
            message : "Order created successfully",
            order : createdOrder
        })
    }catch(err){
        res.status(500).json({
        message : "Failed to create order",
        error : err 
        })
    }

}