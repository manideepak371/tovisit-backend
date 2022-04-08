const mongoose=require('mongoose')

const ImageSchema=new mongoose.Schema({
    placename:{type:String,required:true},
    imagelink:{type:String,required:true}
})

const ImageModel=new mongoose.model('ImageModel',ImageSchema,"images")

module.exports=ImageModel