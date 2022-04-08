var mongoose=require("mongoose")
const crypt=require('bcrypt')
const jwt=require('jsonwebtoken')

const UserSchema=new mongoose.Schema({
    email:{type:String,required:true,unique:true},
    password:{type:String,required:true},
    tokens:[
        {token:{type:String,required:true}}
    ]
})

UserSchema.pre('save',async function(next){
    if(this.isModified('password')){
        const password=await crypt.hash(this.password,12).then(hashed => {return hashed})
        this.password=password
    }
    next()
})

UserSchema.methods.GenerateToken=function(){
    try{
        return new Promise((resolve,reject)=>{
            const token=jwt.sign({email:this.email},APP_PRIVATE_KEY)
            this.tokens=this.tokens.concat({token:token})
            this.save()
            resolve(token)
        })
    }
    catch(e){
        console.log(e)
    }
}

const UserModel=new mongoose.model('UserModel',UserSchema,'usermodels')

module.exports=UserModel
