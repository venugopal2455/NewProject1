const mongoose = require("mongoose")
const Object_id = mongoose.Types.ObjectId
let blogSchema = new mongoose.Schema({
    title: { type: String, required: 'blog tittle is required',trim:true },
    body: { type: String, required: "blog body is required",trim:true },
    authorId: {
        type: Object_id,
        required: "blog Author is required",
        ref: "Auther"
    },
    tags: [{ type: String, required: true,trim:true }],
    category: { type: String, required: true,trim:true },
    subcategory: [{ type: String, required: true ,trim:true}],
    deleteAt: { type: Date,default:null},
    publishedAt: { type: Date,default:null },
    isDeleted: { type: Boolean, default: false },
    isPublished: { type: Boolean, default: false }
}, { timestamps: true });


module.exports = mongoose.model("Blog", blogSchema)