require('dotenv').config()
const {PlaceModel,ImageModel}=require('../models/placeschema')
const multer = require('multer')
const multers3=require('multer-s3')
const S3=require('aws-sdk/clients/s3')
const { Mongoose } = require('mongoose')
const { ObjectId } = require('mongodb')
const formidable=require('formidable')
const e = require('express')

const s3=new S3({
    accessKeyId:process.env.AWS_BUCKET_ACCESS_KEY,
    secretAccessKey:process.env.AWS_BUCKET_SECRET_KEY
})
//retrieve data

exports.default=async (req,res,next)=>{
    try{
        const dbresponse=await PlaceModel.find({isPlace:true},{placename:1,images:1})
        console.log(dbresponse)
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

exports.getPlace=async (req,res,next)=>{
    try{
        var id=req.body.placename
        const dbresponse=await PlaceModel.find({placename:id},{_id:0,__v:0})
        if(dbresponse.length > 0 && dbresponse.length == 1){
            res.status(200).end(JSON.stringify(dbresponse))
        }
        else{res.status(200).end("no data found on this id")}
        next()
    }
    catch(e){
        console.log(e)
        res.status(500).end("server error while retrieving data on this id")
    }
}

exports.getPlaces=async (req,res,next)=>{
    const places=await PlaceModel.find({},{placename:1,isArea:1,isPlace:1,_id:0})
    places.length > 0 ? res.status(200).json(places) : res.status(200).json({success:false})
    next()
}

exports.getDetails=async (req,res,next)=>{
    const placename = req.body.placename
    const places=await PlaceModel.find({placename:placename},{_id:0,__v:0}).populate('images')
    places.length > 0 && places.length == 1 ? res.status(200).json(places) : res.status(200).json({success:false})
}

//add, update data


exports.defaultImage=async (req,res,next)=>{
    const file=req.file
    const newImage=new ImageModel({placename:"default image",imagelink:file.location})
    await newImage.save()
    res.status(200).end("Uploaded")
    console.log("default image uploaded to bucket and link uploaded to db")
}

async function AddPlace(req,res){
    var form=new formidable.IncomingForm()
    try{
        return new Promise((resolve,reject)=>{
            form.parse(req,async (err,fields,files)=>{
                const {placename,startmonth,endmonth,season,isPlace,isArea,parentplace}=fields
                if(!placename || !startmonth || !endmonth || isArea == undefined || isPlace == undefined){
                    console.log(placename,startmonth,endmonth,season,isArea,isPlace)
                    reject({success:false,message:"Please provide required details"})
                }
                if(isArea == true && !parentplace){
                    reject({success:false,message:"Please enter parent place for this area"})
                }
                const place_exist=await PlaceModel.findOne({placename:placename})
                if(!place_exist){
                    const newplace= isArea ? 
                        new PlaceModel({placename,startmonth,endmonth,season,isPlace,isArea,parentplace})   :
                        new PlaceModel({placename,startmonth,endmonth,season,isPlace,isArea})
                    if(parentplace){
                        const parent=await PlaceModel.findOne({placename:parentplace})
                        if(parent){
                            if(!parent.areas){
                                parent.areas=[]
                            }
                            parent.areas.push(placename)
                            await parent.save()
                        }
                        if(!parent){
                            reject({success:false,message:"Parent place doesn't exist in database."})
                        }
                    }
                    const dbresponse=await newplace.save()
                    if(dbresponse){
                        resolve({success:true})
                    }    
                    else{
                        reject({success:false,message:"Failed, not added to database"})
                    }
                }
                if(place_exist){
                    reject({success:false,message:"place already exists"})
                }
            })
        })
    }
    catch(err){
        console.log(err)
    }
}

exports.addPlace=async (req,res,next)=>{
    try{
        const response=await AddPlace(req,res,next).then((result)=>{return result}).catch(err => {return err})
        console.log(response)
        res.json(response)
        return
    }
    catch(e){
        console.log(e)
    }
    finally{
        console.log("add place to db task completed")
    }
}

exports.uploadImages=multer({
    storage:multers3({
        s3:s3,
        bucket:process.env.AWS_IMAGE_BUCKET,
        metadata:function(req,file,cb){
            cb(null,{fieldname:file.fieldname})
        },
        key:function(req,file,cb){
            cb(null,file.originalname + Date.now().toString())
        }
    })
})

exports.updatePlace= async (req,res,next)=>{
    var details={}
    if(Object.keys(req.body).length > 0){
        if(req.body){
            console.log("getting details from req body")
            details=req.body
        }
    }
    var form=new formidable.IncomingForm()
    form.parse(req,(err,fields,files)=>{
        if(fields){
            console.log("getting details from form")
            details=fields
        }
    })
    const {placename,startmonth,endmonth,season,imagekey}=details
    const updatedplace=await PlaceModel.findOne({placename:placename})
    if(startmonth){
        updatedplace.startmonth=startmonth
    }
    if(endmonth){
        updatedplace.endmonth=endmonth
    }
    if(season){
        updatedplace.season=season
    }
    if(imagekey){
        const OLD_IMAGE_LINK=updatedplace.images[0].imagelink
        const OLD_IMAGE_KEY=updatedplace.images[0].key
        var params={
            bucket:process.env.AWS_IMAGE_BUCKET,
            key:OLD_IMAGE_KEY
        }
        const DELETE_RESPONSE=await s3.deleteObject(params)
        console.log("delete image from bucket")
    }
    const dbresponse=await updatedplace.save()
    console.log(dbresponse)
    const file=req.file
    if(file){
        const updatedImage=await ImageModel.findOne({placename:placename,key:imagekey})
        updatedImage.imagelink=file.location
        updatedImage.key=file.key
        const dbimageresponse=await updatedImage.save()
        console.log("updated image link and key in image model")
    }
    if(dbresponse){
        res.json({success:true,message:"updated successfully"})
        console.log("updated")
    }
    if(!dbresponse){
        res.json({success:true,message:"image link not added to db"})
    }
}


exports.deletePlace=async (req,res,next)=>{
    const dbresponse=await PlaceModel.findOne({placename:req.body.placename}).populate('images')
    console.log(dbresponse)
    if(dbresponse){
        if(dbresponse.isArea){
            console.log('deleting area')
            //remove area from parentplace
            const parentPlace=await PlaceModel.findOne({placename:dbresponse.parentplace})
            var index=parentPlace.areas.indexOf(dbresponse.placename)
            parentPlace.areas.splice(index,1)
            await parentPlace.save()
            console.log(parentPlace)
            //remove image link from image model
            await ImageModel.deleteOne({placename:dbresponse.placename})
            //remove image from aws bucket
            //remove document from place model 
            const response=await PlaceModel.deleteOne({placename:dbresponse.placename})
            console.log(response)
            if(response.deletedCount == 1){
                return res.json({success:true,message:'deleted successfully'})
            }
            if(!response){
                return res.json({success:false,message:'Unable to delete this place'})
            }
        }
        if(dbresponse.isPlace){
            console.log('deleting place')
            //get areas related to this pace
            //for each area -  remove image link from image model, remove area from parent place, remove image from bucket,remove document from place model
            if(dbresponse.areas.length > 0){
                dbresponse.areas.forEach(async (area) => {
                    //remove area image from image model
                    await ImageModel.deleteOne({placename:area})
                    //remove area from place model
                    await PlaceModel.deleteOne({placename:area})
                    //remove image from bucket
                });
            }
            //remove image link from image model
            await ImageModel.deleteOne({placename:dbresponse.placename})
            //remove image from bucket
            //remove document from place
            const response=await PlaceModel.deleteOne({placename:dbresponse.placename})
            console.log(response)
            if(response.deletedCount == 1){
                return res.json({success:true,message:'deleted successfully'})
            }
            if(!response){
                return res.json({success:false,message:'Unable to delete this place'})
            }
        }
    } 
    if(!dbresponse){
        res.json({success:false,message:"unable to find this place in database"})
    }
    else{
        return res.json({success:false})
    }
}

exports.addImagetoDB=async (req,res,next)=>{
    const file=req.file
    if(file){
        const newplace=await PlaceModel.findOne({placename:req.body.placename})
        const new_image=new ImageModel({placename:newplace.placename,imagelink:file.location,key:file.key})
        await new_image.save()
        console.log("imaglink added to db")
        newplace.images.push(new_image)
        console.log("image added to place")
        const dbresponse=await newplace.save()
        if(dbresponse){
            res.json({success:true,message:"place added successfully"})
        }
        if(!dbresponse){
            res.json({success:false,message:"place added but image link not added to database"})
        }
    }
}

exports.updatedImagetoDB=async (req,res,next)=>{
    // const file=req.file
    // const imagekey=req.body.imagekey
    // const placename=req.body.placename
    // if(file){
    //     const updatedImage=await ImageModel({placename:placename,imagelink:file.location,key:file.key})
    //     updatedImage.imagelink=file.location
    //     updatedImage.key=file.key
    //     const dbresponse=await await updatedImage.save()
    //     if(dbresponse){
    //         res.json({success:true,message:"updated successfully"})
    //     }
    //     if(!dbresponse){
    //         res.json({success:true,message:"image link not added to db"})
    //     }
    // }
}


exports.testMiddlewareFormData1=(req,res,next)=>{
    console.log("in middleware 2")
    var form=new formidable.IncomingForm()
    form.parse(req,function(err,fields,files){
        console.log(fields)
    })

}

exports.testMiddlewareFormData2=(req,res,next)=>{
    var form=new formidable.IncomingForm()
    form.parse(req,function(err,fields,files){
        console.log(fields)
        console.log(files)
    })
}