import Product from "../models/product.js";
import { isAdmin } from "./userController.js";

export async function getProduct(req,res){
    try{

        if(isAdmin(req)){
            const product = await Product.find()      //admint okkom products balann puluwan 
            res.json(product)
        }else{
            const product = await Product.find({isAvalabale : true})  //habi user kenkta avalabele products vitharai pennane
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

export async function updateProduct(req,res){
    if(!isAdmin(req)){
        res.status(403).json({
            message : "You are not authorized to update a product"
        })
        return
    }

    const productId = req.params.productId
    const updatingData = req.body

    try{
        await Product.updateOne(
            {productId : productId},
            updatingData
        )
        res.json({
           message : "Product updated successfully",
            
        })

    }catch(err){
        res.status(500).json({
           message : "Internal server error",
            error : err 
        })
    }
}


export async function getProductById(req,res){
    const productId = req.params.productId

    try{

        const product = await Product.findOne(
            {productId : productId}
        )

        if(product == null){                        //methana waradai productId ekakda kiyala check karanwa
            res.status(404).json({
                message : "Product not found"
            })
            return
        }
        if(product.isAvalabale){                   //product eka isAvalable nam e product eka pennawa
            res.json(product)
        }else{
            if(!isAdmin(req)){                     //product eka isAvalable novi aya admin kenekuth neminm error ekka pennawa 
               res.status(404).json({
                message : "Product not found"
            })
            return 
            }else{                                 //product eka isAvalable novi aya admin kenek nam ayat product eka pennawa
                res.json(product)
            }
        }

    }catch(err){
        res.status(500).json({
           message : "Internal server error",
            error : err 
        })
        return
    }


}
