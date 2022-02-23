var express=require('express')
var app=express()

var PlaceRouter=require('./api/routes/placerouter')
var UserRouter=require('./api/routes/userrouter')
const mongoose=require('mongoose')
const connectionString="mongodb://localhost:27017/places"
mongoose.connect(connectionString)


app.use(express.urlencoded({extended:true}))
app.use(express.json())

app.use('/',PlaceRouter)
app.use('/admin',UserRouter)

module.exports=app