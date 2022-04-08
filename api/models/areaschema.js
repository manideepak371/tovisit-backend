const mongoose = require("mongoose")

const AreasSchema=new mongoose.Schema({
    areas:[{area:{type:String,required:true}}],
    placename:{type:String,required:true,ref:"PlaceModel"}
})

const AreasModel=new mongoose.model('AreasModel',AreasSchema,'areas')

module.exports=AreasModel