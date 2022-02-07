var express=require('express')
var app=express()
var PlaceRouter=require('./api/routes/placerouter')
app.use(express.urlencoded({extended:true}))
app.use(express.json())

app.use('/',PlaceRouter)

module.exports=app