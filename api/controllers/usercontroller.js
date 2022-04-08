const UserModel=require('../models/userschema')
const crypt=require('bcrypt')
const jwt=require('jsonwebtoken')
const jwtDecode=require('jwt-decode')

const PRIVATE_KEY='TO@4VISIT@4INDIA'


function getCookie(req,key){
    let str=req.headers['cookie']
    let a=str.split('=')
    for(var i=0;i<a.length;i++){
        if(a[i] == key){
            return a[i+1]
            break
        }
    }
}

var headers={
    setResHeaders:function(req,res,next){
        res.setHeader('Access-Control-Allow-Origin','http://localhost:3000')
        res.setHeader('Access-Control-Allow-Method','POST,GET')
        res.setHeader('Access-Control-Allow-Headers','Origin,Accept,X-Requested-With,Content-Type')
        res.setHeader('Access-Control-Allow-Credentials','true')
    }
}

exports.AuthUser=async (req,res,next) =>{
    if(req.headers['cookie']){
        var token = getCookie(req,"authToken")
        const verified=jwt.verify(token,PRIVATE_KEY)
        const result=await UserModel.find({email:verified})
        if(result && result.length == 1){
            next()
        }
        else{
            res.status(200).json({message:"login required",success:false})
        }
    }
    else{
        res.status(200).json({message:"login required",success:false})
    }
}

exports.Login= async (req,res,next)=>{

    try{
        headers.setResHeaders(req,res)
        const {email,password}=req.body
        console.log(req.body)
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
                // const token=await exists.GenerateToken().then(token => {return token})
                const token=jwt.sign(email,PRIVATE_KEY)
                console.log(jwtDecode(token,{header:true}))
                res.cookie('authToken',token,{maxAge:10000,sameSite:"none",secure:true,httpOnly:true})
                res.status(200).json({message:"logged in successfully",success:true,id:email})
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