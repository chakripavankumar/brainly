import express from "express";
import jwt from "jsonwebtoken"
import cors from 'cors';
import { ContentModel, LinkModel, UserModel } from "./db";
import {JWT_PASSWORD} from "./config"
import { Usermiddleware } from "./middleware";
import { random } from "./utils";

const app = express();
app.use(express.json())
app.use(cors());

app.post("/signup" ,  async (req,res)=>{
    const username = req.body.username;
    const password = req.body.password;
    try {
         await UserModel.create({
            username:username,
            password:password
         })
         res.json({
            message: "user signed up"
         })
    } catch (error) {
        res.status(411).json({
            messsage :  console.log(error)
        })
    }

})
app.post("/signin" ,  async( req, res) => {
    const username = req.body.username;
    const password  =  req.body.password;
    const existingUser = await UserModel.findOne({
        username,
        password
    })
    if(existingUser){
        const token = jwt.sign({
            id:existingUser._id
        },JWT_PASSWORD)
        res.json({
            token
        })
    }else{
        res.status(403).json({
            message : "incorrect Credentsils"
        })
    }

})
app.post("/content", Usermiddleware,(req,res) => {
    try {
        const link = req.body.link;
    const type= req.body.type;
    const title = req.body.title;
    ContentModel.create({
        link,
        type,
        title,
        //@ts-ignore
        userId: req.userId,
        tags:[]
    })
    res.json({
        message : " content added"
    })
    } catch (error) {
        res.status(411).json({
            messsage :  console.log(error)
        })
    }

})
app.get("/content", Usermiddleware,async (req,res)=>{
    //@ts-ignore
    const userId = req.userId;
    const content = await ContentModel.findOne({
        userId:userId
    }).populate("userId" , "username")
    res.json({
        content
    })
})
app.get("/share", (req,res)=>{

})
app.delete("/contentId/delete", Usermiddleware, async(req,res)=>{
    const contentId = req.body.contentId;
    await ContentModel.deleteMany({
        contentId,
        //@ts-ignore
        userId:req.userId
    })
      res.json({
        message : "content deleted"
      })
})
app.get("/shareLink", (req,res)=>{
    const share = req.body.share;
    if (share){
        LinkModel.create({
            userId:req.userId,
            hash: random(10)
        })
    }else{
        LinkModel.deleteOne({
            userId:req.userId
        })
    }

})

app.listen(3002 , ()=> console.log("server is runiing in 3002"));