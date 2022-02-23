const { MongoGridFSChunkError } = require('mongodb')
var mongoose=require('mongoose')


const PlaceSchema=new mongoose.Schema({
    placename:{type:String,required:true,unique:true},
    startmonth:{type:String,required:true,enum:["January","February","March","April","May","June","July","August","September","October","November","December"]},
    endmonth:{type:String,required:true,enum:["January","February","March","April","May","June","July","August","September","October","November","December"]},
    season:{type:String,required:true,enum:["Winter","Summer","Monsoon"]},
    city:{type:String},
    areas:[
        {
            areaname:{type:String}
        }
    ]
})

const PlaceModel=new mongoose.model('PlaceModel',PlaceSchema,'placemodels')


module.exports=PlaceModel