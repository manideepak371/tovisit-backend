const mongoose=require('mongoose')

const AuthorSchema=new mongoose.Schema({
    author:{type:String,required:true},
    stories:[{type:mongoose.Types.ObjectId,required:true,ref:"StoryModel"}]

})

const StorySchema=new mongoose.Schema({
    story:{type:String,required:true},
    genre:{type:String,required:true},
    author:{type:mongoose.Types.ObjectId,required:true,ref:"AuthorModel"}
})

exports.AuthorModel=new mongoose.model('AuthorModel',AuthorSchema)
exports.StoryModel=new mongoose.model('StoryModel',StorySchema)