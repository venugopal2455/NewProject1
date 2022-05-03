const express = require("express")

const router = express.Router();

const authorController = require("../controllers/authorController")
const blogController = require("../controllers/blogController")

const middleware = require("../middleware/auth")




router.post("/authors", authorController.registerAuthor);

router.post("/blogs", middleware.authentication, blogController.createblog);

router.get("/blogs", middleware.authentication, blogController.getblog);

router.delete("/blogs/:blogId", middleware.authentication, middleware.authorisation, blogController.deleted);

router.delete("/blogs", middleware.authentication, middleware.md3, blogController.deletequery);

router.put("/blogs/:blogId", middleware.authentication, middleware.authorisation, blogController.updateBlog);

router.post("/login", authorController.loginAuthor);













module.exports = router;