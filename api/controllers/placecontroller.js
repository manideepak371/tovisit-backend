const PlaceModel=require('../models/placeschema')

exports.default=async (req,res,next)=>{
    try{
        const dbresponse=await PlaceModel.find({},{_id:0,__v:0})
        if(dbresponse.length > 0){
            console.log(dbresponse)
            res.status(200).end(JSON.stringify(dbresponse))
        }
        else{
            console.log("hello3")
            res.status(200).end("no data")
        }
    }
    catch(e){
        res.status(500).end("Places not retrieved")
    }
}

exports.addPlace=async (req,res,next)=>{
    try{
        const {placename,startmonth,endmonth,season,city,areas}=req.body
        if(!placename || !startmonth || !endmonth || !season){
            res.status(406).end("Please provide required details")
        }
        const place_exist=await PlaceModel.findOne({placename:placename})
        if(!place_exist){
            const newplace=new PlaceModel({placename,startmonth,endmonth,season,city,areas})
            const dbresponse=await newplace.save()
            res.status(200).end("place added successfully")    
        }
        if(place_exist){
            res.status(409).end("place already exists")
        }
    }
    catch(e){
        console.log(e)
    }
    finally{
        next()
    }
}

exports.getPlace=async (req,res,next)=>{
    try{
        var id=req.body.placename
        const dbresponse=await PlaceModel.find({placename:id},{_id:0,__v:0})
        if(dbresponse.length > 0 && dbresponse.length == 1){
            res.status(200).end(JSON.stringify(dbresponse))
        }
        else
        {
            res.status(200).end("no data found on this id")
        }
        next()
    }
    catch(e){
        console.log(e)
        res.status(500).end("server error while retrieving data on this id")
    }
}