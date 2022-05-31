var express=require('express')
var app=express()
var cors=require('cors')
var cookieParser=require('cookie-parser')
var bodyParser=require('body-parser')
require('dotenv').config
var PlaceRouter=require('./api/routes/placerouter')
const mongoose=require('mongoose')
const connectionString="mongodb://localhost:27017/places"
mongoose.connect(connectionString)


app.use(express.urlencoded({extended:true}))
app.use(express.json())
app.use(bodyParser.urlencoded({extended:true}))
app.use(bodyParser.json())
app.use(cookieParser())
app.use(cors({
    origin:"http://localhost:3000",
    credentials:true
}))

app.use('/',PlaceRouter)

module.exports=app