var express=require('express')
var app=express()
var cors=require('cors')
var cookieParser=require('cookie-parser')
require('dotenv').config
var PlaceRouter=require('./api/routes/placerouter')
var UserRouter=require('./api/routes/userrouter')
var ImageRouter=require('./api/routes/imagerouter')
const mongoose=require('mongoose')
const connectionString="mongodb://localhost:27017/places"
mongoose.connect(connectionString)


app.use(express.urlencoded({extended:true}))
app.use(express.json())
app.use(cookieParser())
app.use(cors({
    origin:"http://localhost:3000",
    credentials:true
}))

app.use('/',PlaceRouter)
app.use('/admin',UserRouter)
app.use('/image',ImageRouter)

module.exports=app