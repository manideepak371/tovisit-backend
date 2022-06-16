const { MongoGridFSChunkError, ObjectId } = require('mongodb')
var mongoose=require('mongoose')


const PlaceSchema=new mongoose.Schema({
    placename:{type:String,required:true,unique:true},
    startmonth:{type:String,required:true,enum:["January","February","March","April","May","June","July","August","September","October","November","December"]},
    endmonth:{type:String,required:true,enum:["January","February","March","April","May","June","July","August","September","October","November","December"]},
    season:{type:String,required:true,enum:["Winter","Summer","Monsoon Rains","Spring","All Seasons"]},
    parentplace:{type:String},
    isPlace:{type:Boolean,required:true},
    isArea:{type:Boolean,required:true},
    areas:[{type:mongoose.Schema.Types.ObjectId,ref:"AreaModel"}],
    images:[{type:mongoose.Schema.Types.ObjectId,required:true,ref:"ImageModel"}]
})


const ImageSchema=new mongoose.Schema({
    placename:{type:String,required:true},
    imagelink:{type:String,required:true},
    key:{type:String,required:true}
})

const AreaSchema=new mongoose.Schema({
    placename:{type:String,required:true,unique:true},
    parentplace:{type:String},
    isPlace:{type:Boolean,required:true},
    isArea:{type:Boolean,required:true},
    images:[{type:mongoose.Schema.Types.ObjectId,required:true,ref:"ImageModel"}]
})

exports.ImageModel=new mongoose.model('ImageModel',ImageSchema,"images")

exports.AreaModel=new mongoose.model('AreaModel',AreaSchema,'areas')

exports.PlaceModel=new mongoose.model('PlaceModel',PlaceSchema,'places')
