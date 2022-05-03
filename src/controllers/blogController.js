const authorModel=require('../models/authorModel')
const blogModel=require('../models/blogModel')
const moment=require('moment')
let createblog = async function (req, res) {
    try {
        let data = req.body;
        const { title, body, authorId, tags, category, subcategory } = data

        if (Object.keys(data).length == 0) return res.status(400).send({ status: false, message: "Please Enter Data" });
        if (!title) return res.status(400).send({ status: false, message: "Please enter your Blogs title" });
        if (!title.trim()) return res.status(400).send({ status: false, message: "Please Enter Your Blog Title This is Mandatory" });

        if (!body) return res.status(400).send({ status: false, message: "Please Enter Blogs Details" });
        if (!body.trim()) return res.status(400).send({ status: false, message: "Please Write Somthing About Your Blog" });

        if (!tags) return res.status(400).send({ status: false, message: "Please Enter Your Blog  Tags" });
        if (!tags.trim()) return res.status(400).send({ status: false, message: "Please Enter Your Blog Tag This is Mandatory" });

        if (!category) return res.status(400).send({ status: false, message: "Please Enter Your Blog category" });
        if (!category.trim()) return res.status(400).send("Please Enter Your Blog Category");

        if (!subcategory) return res.status(400).send({ status: false, message: "Please Enter Your Blog's subcategory" });
        if (!subcategory.trim()) return res.status(400).send("Please Enter Blog Subcategory");

        if (!authorId) return res.status(400).send({ status: false, message: "Please Enter Author id" });
        if (!authorId.trim()) return res.status(400).send({ status: false, message: "Please Enter your Autherid This is mandatory" });

        let modelid = await authorModel.findById({ _id: authorId });
        if (modelid == null) return res.status(400).send({ status: false, message: "No auther exist with this author id Please register first" })
        let id = modelid._id;
        if (!(id == authorId)) return res.status(400).send({ status: false, message: "Please enter a avlid autherId" });

        data.publishedAt = Date.now();

        let createBlog = await blogModel.create(data);
        res.status(201).send({ status: true, message: "Your blog is Successfully crearted", data: createBlog });
    }
    catch (err) {
        res.status(500).send({ status: false, message: err.message })
    }
};


/////+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
let getblog = async function (req, res) {
    try {
         let data=req.query
    
         let getData =await blogModel.find( {$and : [data, { isDeleted: false }, { isPublished: true }]})
        
        if(!(data))
    getData = await blogModel.find({ isDeleted: false, isPublished: true})
        
        if (getData.length===0)
            return res.status(404).send({ status: false, msg: "Blogs are not present" })
        res.status(200).send({ status: true, msg: getData })
    }
    catch (error) {
        res.status(500).send({ status: false, msg: error.message })
    }
}

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

const updateBlog = async function (req, res) {
    try {
        let blogId = req.params.blogId;
    
        let blogTitle = req.body.title;
        let blogBody = req.body.body;
        let blogTags = req.body.tags;
        let blogSubcategory = req.body.subcategory;
        blogPublishedDate = moment();
        if (!blogId) return res.status(400).send({ status: false, message: "id is missing" });
        let blog = await blogModel.findById({ _id: blogId });
        if (!blog) return res.status(404).send({ status: false, message: "no such blog exist with this id" });
        blog.title = blogTitle;
        blog.body = blogBody;
        blog.tags = blogTags;
        blog.subcategory = blogSubcategory;

        let updatedData = await blogModel.findOneAndUpdate(

            { _id: blogId },
            { title: blogTitle, body: blogBody, $push: { tags: blogTags, subcategory: blogSubcategory }, publishedAt: blogPublishedDate, isPublished: true },
            { new: true, upsert: true }
        )

        res.status(200).send({ status: true,message:"Data update successsfully", data: updatedData })
    } catch (err) {
        res.status(500).send({ status: false, message: err.message })
    }

};

// ===++++++++++++++++++++++++++++++++++++++===========================================================
let deleted = async function (req, res) {
    try {
        let blogid = req.params.blogId;
        if (!blogid) return res.status(400).send({ status: false, message: "Please enter Blog id" })
        let modelid = await blogModel.find({ _id: blogid, isDeleted: false })
        if (!modelid) return res.status(404).send({ status: false, message: "Record  Not found" });

        let modified = await blogModel.findByIdAndUpdate({ _id: blogid }, { $set: { isDeleted: true, deleteAt: Date.now() } }, { new: true })
        res.status(201).send({ status: true, message: "Your Blog Is Successfully Deleted" })
    } catch (err) {
        res.status(500).send({ status: false, message: err.message })
    }
};
// -=====================================================================================================
let deletequery = async function (req, res) {
    try {
        let data = req.query;
        let mydata = []
    
        if (Object.keys(data).length == 0) return res.status(400).send({ status: false, message: "Please enter data" })
        let deletedata = await blogModel.find(data)
        if (!deletedata) return res.status(404).send({ status: false, message: "Such Blog not found" })

        for (let i = 0; i < deletedata.length; i++) {
            mydata[i] = deletedata[i];
        }

        for (let i = 0; i < mydata.length; i++) {
            if (mydata[i].isDeleted != true) {
                mydata[i] = await blogModel.updateMany(mydata[i], { $set: { isDeleted: true } }, { new: true, upsert: true })
            }
        }
        res.status(201).send({ status: true, message: "Blog is successfully deleted" })
    }
    catch (err) {
        res.status(500).send({ status: false, message: err.message })
    }
};


module.exports = { getblog, deleted, deletequery,createblog,updateBlog}
