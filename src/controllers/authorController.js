const authorModel=require('../models/authorModel')
const jwt=require('jsonwebtoken')
let registerAuthor = async function (req, res) {
    try {

        const data = req.body
        const { fname, lname, title, email, password } = data;

        let regx = /^([a-zA-Z0-9\._]+)@([a-zA-Z0-9]+.)([a-z]+)(.[a-z])?$/
        if (Object.keys(data).length == 0) return res.status(400).send({ status: false, message:"Please Enter Data"});

        if (!fname) return res.status(400).send({ status: false, message: "Please enter your First Name " })
        if (!fname.trim()) return res.status(400).send({ status: false, message: "Please Enter your First Name This is Mandatory" });

        if (!lname) return res.status(400).send({ status: false, message: "Please Enter Your Last Name" })
        if (!lname.trim()) return res.status(400).send({ status: false, message: "Please Enter your Last Name This is Mandatory" });

        if (!title) return res.status(400).send({ status: false, message: "Please Enter Your Title" })
        if (!title.trim()) return res.status(400).send({ status: false, message: "Please Enter your Title This is Mandatory" });

        if (!email) return res.status(400).send({ status: false, message: "Please Enter Your Email " })
        if (!email.trim()) return res.status(400).send({ status: false, message: "Please Enter your Email This is Mandatory" });
        
        const uniqemail = await authorModel.findOne({ email: email });
        if (uniqemail) return res.status(400).send({ status: false, message: "Email Allready Exist" })
        if (!regx.test(email)) return res.status(400).send({ status: false, message: "Please Enter a valid EmailId" });

        if (!password) return res.status(400).send({ status: false, message: "Please Enter Your Password" })
        if (!password.trim()) return res.status(400).send({ status: false, message: "Please Enter your Password This is Mandatory" });
        let passcheck = password.trim();
        let valid = passcheck.length;
        if (!(valid >= 8 && valid <= 20)) return res.status(400).send({ status: false, message: "Please Enter a valid Password" });

        let authercreated = await authorModel.create(data);
        res.status(201).send({ status: true, message: "You are successfully Register", data: authercreated })
    }
    catch (err) {
        res.status(500).send({ status: false, Error: err.message })
    }
};
// --------------------------------------------------------------------------------------------------------------
let loginAuthor = async function (req, res) {
    try {
        let data = req.body;
        if (Object.keys(data).length == 0) return res.status(400).send({ status: false, message: "Please enter your email and password" })
        let email = req.body.email;
        let password = req.body.password;

        let regx = /^([a-zA-Z0-9\._]+)@([a-zA-Z0-9]+.)([a-z]+)(.[a-z])?$/;

        if (!email) return res.status(400).send({ status: false, message: "Please entre Your email id" });
        if (!email.trim()) return res.status(400).send({ status: false, message: "Please Enter Your Email" });

        if (!password) return res.status(400).send({ status: false, message: "Please enter Your password" })
        if (!password.trim()) return res.status(400).send({ status: false, message: "Please enter Your password" });

        if (!regx.test(email)) return res.status(400).send({ status: false, message: "Please enter a valid email id" });
        let user = await authorModel.findOne(data);
        if (Object.keys(user).length == 0) return res.status(400).send({ status: false, message: "Please check your email or password" });
        let token = jwt.sign({ userId: user._id.toString(), group: "group-5" }, "Group-5");
        res.setHeader("x-api-key", token)
        res.status(201).send({ status: true, message: "You are Successfully Logined", token: token })

    } catch (err) {
        res.status(500).send({ status: false, message: err.message })
    }
};

module.exports={registerAuthor,loginAuthor}