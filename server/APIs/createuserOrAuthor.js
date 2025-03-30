const UserAuthor=require("../models/userAuthorModel")

async function createUserOrAuthor(req,res){
    //busines logic to create user or Author
    const newUserAuthor=req.body;
    //find user by emil id 
   const userInDb  =  await UserAuthor.findOne({email:newUserAuthor.email})
////////if user or author existed
if(userInDb!==null){
    if(newUserAuthor.role===userInDb.role){
          res.status(200).send({message:newUserAuthor.role,payLoad:userInDb})
    }else{
        res.status(200).send({message:"invalid role"})
    }
}else{
    let newUser=new UserAuthor(newUserAuthor);
    let newUserAuthorDoc=await newUser.save()
       res.status(201).send({message:newUserAuthorDoc.role,payLoad:newUserAuthorDoc})
}

}


module.exports=createUserOrAuthor