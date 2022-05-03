

const mongoose = require("mongoose")

let authorSchema = new mongoose.Schema({
    fname: { type: String, required: 'first name is Required', trim: true },
    lname: { type: String, required: "last name is required", trim: true },
    title: { type: String, required: "Title is required", trim: true, enum: ["Mr", "Mrs", "Miss","Mast"] },
    email: { type: String, trim:true,lowercase:true,required: "Email address is required", unique: true,
validate:{
    validator:function(email){
        return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)
    },message:"please fill a valid email address",isAsync:false
} },
    password: { type: String, required:"Password is required", minlength: 8, maxlength: 20 }
}, { timestamps: true });


module.exports = mongoose.model("Author", authorSchema)