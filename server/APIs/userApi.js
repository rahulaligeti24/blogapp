const exp=require('express')
const userApp=exp.Router()
const UserAuthor=require("../models/userAuthorModel")
const expressAsyncHandler=require('express-async-handler')
const createUserOrAuthor=require('./createuserOrAuthor')
const Article=require("../models/articleModel")
//create new user//

userApp.post("/user",expressAsyncHandler(createUserOrAuthor))


//add comment//

userApp.put('/comment/:articleId',expressAsyncHandler(async(req,res)=>{
    const commentObj=req.body;
    //add comment to obj comments array of article

    const articlewithcomments=await Article.findOneAndUpdate({articleId:req.params.articleId},
        {$push:{comments:commentObj}},
        {returnOriginal:false})

    res.status(200).send({message:"comment added",payLoad:articlewithcomments})
}))

module.exports=userApp;
