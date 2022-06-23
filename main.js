var express=require('express')
var app=express()
var cors=require('cors')
var cookieParser=require('cookie-parser')
var bodyParser=require('body-parser')
require('dotenv',{path:'./env/.env'}).config
var PlaceRouter=require('./api/routes/placerouter')
const mongoose=require('mongoose')
const MONGO_DB_LOCAL_URL="mongodb://localhost:27017/"


mongoose.connect(process.env.MONGO_DB_URL || MONGO_DB_LOCAL_URL,).then(()=>{
    console.log(process.env.MONGO_DB_URL)
    console.log("connected to mongo db server")
})


app.use(express.urlencoded({extended:true}))
app.use(express.json())
app.use(bodyParser.urlencoded({extended:true}))
app.use(bodyParser.json())
app.use(cookieParser())
app.use(cors({
    origin:"*",
    credentials:true
}))

// app.use('/',(req,res)=>{
//     res.status(200).end("welcome tovisit /")
// })
app.use('/tovisit',PlaceRouter)

module.exports=app