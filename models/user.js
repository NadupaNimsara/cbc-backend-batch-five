import mongoose from "mongoose";

const userSchema = mongoose.Schema(
    {
        email: {
            type : String,
            required : true,   //database eka save wena hama user kenktama email ekka thiynawanm required danwa(hamotam thiyanna one)
            unique : true
        },
        firstName : {
            type : String,
            required : true
        },
        lastName : {
            type : String,
            required : true
        },
        password : {
            type : String,
            required : true
        },
        role : {
            type : String,
            required : true,
            default : "customer"  //kisim type ekak noda save unoth  ayata custormer role eka denna kiyannai
        },
        isBlocked : {
            type : Boolean,
            required: true,
            default : false
        },
        img : {
            type : String,
            required : false,
            default : "https://avatar.iran.liara.run/public/boy?username=Ash"
        },



    });

    const User = mongoose.model("users",userSchema);//methana model kiyala hariyatama thiaynna one Model kiyala thiboth waradi

export default User; //export wenna one me 42 line eke thiyana name eka 