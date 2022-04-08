const express=require('express')
const Router = express.Router()
const UserController=require('../controllers/usercontroller')

Router.post('/login',UserController.Login)
Router.post('/register',UserController.Register)
Router.get('/',function(req,res){
    res.cookie('auth',"test")
    res.end("test")
})

module.exports=Router