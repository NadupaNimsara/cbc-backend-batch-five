import Product from "../models/product.js";
import { isAdmin } from "./userController.js";

export async function getProduct(req,res){
    try{

        if(isAdmin(req)){
            const product = await Product.find()
            res.json(product)
        }else{
            const product = await Product.find({isAvalabale : true})
        res.json(product)
        }
        

    }catch(err){
        res.json({
            message : "Failed to get product"
        })
    }
}



export function saveProduct(req,res){

    if(!isAdmin(req)){
        res.status(403).json({
            message : "You are not authorized to add a product "
        })
        return
    }
   
    console.log(req.body);

    const product = new Product(
        req.body
    );

    product.save().then(()=>{
        res.json({
           massage : "Product added successfully" 
        })    
    }).catch(()=>{
            res.json({
                massage : "Failed to add product"
            });
        });
}

export async function deleteProduct(req,res){
    if(!isAdmin(req)){
        res.status(403).json({
            message : "You are not authorized to delete a product"
        })
        return
    }
    try{
        await Product.deleteOne({productId : req.params.productId})   //ena request eka body eke nathuwa url eke awan nisa req.params kiyala denne

    res.json({
        message : "Product deleted successfuly"
    })
    }catch(err){
        res.status(500).json({
            message : "Failed to delete product",
            error : err
        })
    }
    
}