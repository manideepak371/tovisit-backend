const PlaceModel=require('../models/placeschema')
const AreasModel=require('../models/areaschema')

exports.default=async (req,res,next)=>{
    try{
        const dbresponse=await PlaceModel.find({},{placename:1})
        if(dbresponse.length > 0){
            res.status(200).json({data:dbresponse,success:true,message:"data retrieved"})
        }
        else{
            res.status(200).json({success:true,message:"no data"})
        }
    }
    catch(e){
        res.status(500).json({success:true,message:"Places not retrieved"})
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
            const newplace=new PlaceModel({placename,startmonth,endmonth,season,city})
            const dbresponse=await newplace.save()
            console.log(dbresponse)
            if(areas?.length > 0){
                const newArea=new AreasModel({areas,placename})
                const addArea=await newArea.save()
            }
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

exports.getPlaces=async (req,res,next)=>{
    const places=await PlaceModel.find({},{placename:1,_id:0})
    places.length > 0 ? res.status(200).json(places) : res.status(200).json({success:false})
    next()
}

exports.getImages=async (req,res,next)=>{
    const places=await PlaceModel.find({},{placename:1})
    places.length > 0 ? res.status(200).json(places) : res.status(200).json({success:false})
    next()
}

exports.getDetails=async (req,res,next)=>{
    const placename = req.body.place
    const places=await PlaceModel.find({placename:placename},{_id:0,__v:0})
    places.length > 0 && places.length == 1 ? res.status(200).json(places) : res.status(200).json({success:false})
    next()
}