const UserModel=require('../models/userschema')
const crypt=require('bcrypt')
const jwt=require('jsonwebtoken')
const APP_PRIVATE_KEY="something@1234something"

exports.UserAuth= async (req,res,next)=>{
    try{
        const {email,password}=req.body
        if(!email || !password){
            res.status(406).end("Please provide required details")
        }
        const user= await new UserModel({email,password})
        const exists=await UserModel.findOne({email:email})
        if(exists){
            //compare password
            const pwd_match=await crypt.compare(password,exists.password).then(result => {return result})
            //return response
            if(pwd_match){
                //generate token
                const token=await exists.GenerateToken().then(token => {return token})
                res.cookie('authtoken',token,{maxAge:1800})
                res.status(200).end("logged in successfully")
            }
            else{
                res.status(200).end("Only Admin can login, please enter valid admin credentials")
            }
        }
        if(!exists){
            res.status(200).end("Only Admin can login, please enter valid admin credentials")
        }
    }
    catch(e){
        console.log(e)
    }
    finally{
        next()
    }
}

exports.Register=async (req,res,next)=>{
    try{
        const {email,password}=req.body
        if(!email || !password){
            res.status(406).end("Please provide required details")
        }
        const user= await new UserModel({email,password})
        const exists=await UserModel.findOne({email:email})
        //user already exists
        if(exists){
            res.status(200).end("Admin email already registered, please login with same email id")   
        }
        if(!exists){
            const documents_count=await UserModel.count()
            if(documents_count == 0){
                //save user
                const save_user=await user.save()
                res.status(200).end("user added")
            }
            else{
                res.status(200).end("unauthorized")
            }
        }
    }
    catch(e){
        console.log(e)
    }
    finally{
        next()
    }
}