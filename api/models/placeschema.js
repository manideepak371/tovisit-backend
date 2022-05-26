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
    areas:[{type:String}],
    images:[{type:mongoose.Schema.Types.ObjectId,required:true,ref:"ImageModel"}]
})


const ImageSchema=new mongoose.Schema({
    placename:{type:String,required:true},
    imagelink:{type:String,required:true},
    key:{type:String,required:true}
})

exports.ImageModel=new mongoose.model('ImageModel',ImageSchema,"images")

exports.PlaceModel=new mongoose.model('PlaceModel',PlaceSchema,'places')
