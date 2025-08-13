import User from "../models/user.js";
import bcrypy from "bcrypt";
import jwt from "jsonwebtoken";

export function createUser (req,res){
    //admin kenekda kiyala check karanawa
    if(req.body.role == "admin"){
        if(req.user !=null){                  // req eke token ekak dala awanawanm eka enne req.user kiyala
            if(req.user.role != "admin"){   
                res.status(403).json({
                    message : "You are not authorized to creat an admin account"
                })
                return
            }

        }else{
            res.status(403).json({
                message : "You are not authorized to create an admin account.please login first"
            })
            return
        }

    }

    const hashPassword = bcrypy.hashSync(req.body.password, 10)       //hashing karan kotasa

    const user = new User({
        email : req.body.email,
        firstName : req.body.firstName,
        lastName : req.body.lastName,
        password : hashPassword,
        role : req.body.role,
        
    })

    user.save().then(()=>{
        res.json({
            massage : "User create successfully"
        });
    }).catch(()=>{
        res.json({
            massage : "Failed to create user"
        })
    })
 }




export function loginUser(req,res){
    
    const email = req.body.email
    const password = req.body.password

    User.findOne({email : email}).then((user)=>{
        if(user == null){
            res.status(404).json({
                message : "User not found"
            })
        }else{
            const isPasswordCorrect = bcrypy.compareSync(password ,user.password)

            if(isPasswordCorrect){

            const token = jwt.sign(
                {
                email : user.email,
                firstName : user.firstName,
                lastName : user.lastName,
                role : user.role,
                img : user.img,
            },
            "cbc-batch-five#@2025"
        )


            res.json({
                message : "Login successfuly",
                token : token,
            })
        }else{
            res.status(404).json({
                message: "Invalid password"
            })
        }
        }
        
    })

}

export function isAdmin(req){
     if (req.user == null){
        return false
    }

    if(req.user.role != "admin"){
       return false
    }
    return true
}
