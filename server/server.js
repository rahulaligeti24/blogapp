const exp=require('express')
const app=exp()
require('dotenv').config() 
const mongoose=require('mongoose');
const userApp = require('./APIs/userApi');
const adminApp = require('./APIs/adminApi');
const authorApp = require('./APIs/authorApi');
const cors=require('cors')
app.use(cors())

const port=process.env.PORT || 4000;

 



mongoose.connect(process.env.DBURL)
.then(()=>app.listen(port,()=>console.log(`server listening on port ${port}...`)))
.catch(err=>console.log("err in db connection ",err))


app.use(exp.json());


app.use('/user-api',userApp)
app.use("/author-api",authorApp)
app.use("/admin-api",adminApp)
 

app.use((err,req,res,next)=>{
    console.log("err object in express error handler :",err)
    res.send({message:err.message})
})