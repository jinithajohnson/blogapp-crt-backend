const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const bcrypt = require("bcrypt")
const jwtoken = require("jsonwebtoken")
const { usermodel } = require("./models/blog")
const  postModel  = require("./models/post")
let app = express()
app.use(cors())
app.use(express.json())
mongoose.connect("mongodb+srv://jinithajohnson:jingov02@cluster0.wo3ieyl.mongodb.net/blogAppDb?retryWrites=true&w=majority&appName=Cluster0")

app.post("/signup", async (req, res) => {
    let input = req.body
    let hashedPassword = bcrypt.hashSync(req.body.password, 10)
    console.log(hashedPassword)
    req.body.password = hashedPassword

    usermodel.find({ email: req.body.email }).then(
        (items) => {

            if (items.length > 0) {
                res.json({ "status": "email Id already exist" })

            } else {

                let result = new usermodel(input)
                result.save()
                res.json({ "status": "success" })

            }
        }
    ).catch(
        (error) => { }

    )
})


//create post

app.post("/create",async(req,res)=>{
    let input=req.body

    let token=req.headers.token

    jwtoken.verify(token,"blogApp",async (error,decoded)=>{
        if (decoded && decoded.email)  {

            let result=new postModel(input)
            await result.save()
            res.json({"status":"success"})


        } else {
            res.json({"status":"invalid authentication"})
        }
    

})

})


//signin

app.post("/signin", async (req, res) => {

    let input = req.body
    let result = usermodel.find({ "email": req.body.email }).then(
        (items) => {

            if (items.length > 0) {

                const passwordValidator = bcrypt.compareSync(req.body.password, items[0].password)
                if (passwordValidator) {
                    jwtoken.sign({ email: req.body.email }, "blogApp", { expiresIn: "1d" },
                        (error, token) => {
                            if (error) {
                                res.json({ "status": "error", "errorMessage": error })
                            } else {
                                res.json({ "status": "success", "token": token, "userId": items[0]._id })
                            }
                        })


                } else {
                    res.json({ "status": "incorrect password" })
                }
            } else {
                res.json({ "status": "invalid emailid" })
            }

        }
    ).catch()


})


app.listen(8000, () => {
    console.log("server running")
})

