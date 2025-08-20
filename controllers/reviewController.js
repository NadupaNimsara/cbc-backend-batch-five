import Review from "../models/review.js"

export async function createReview(req,res){
    if(req.user == null){
        res.status(403).json({
            message : "Please login and try again"
        })
        return
    }
    try{
        const reviewinfo = req.body
        reviewinfo.name = req.user.firstName + " " + req.user.lastName

    const review = new Review({
        productId : reviewinfo.productId,
        name : reviewinfo.name,
        email : req.user.email,
        rating : reviewinfo.rating,
        comment : reviewinfo.comment,
    });

    const createReview = await review.save()

        res.json({
            message : "Review created successfully",
            review : createReview
        })
        }catch(err){
            res.status(500).json({
             message : "Failed to create review",
             error : err 
        })
        }
}