require('dotenv').config()
const Router=require('express').Router()
const ImageModel=require('../models/imageschema')
var {IncomingForm}=require('formidable')
var fs=require('fs')
var S3=require('aws-sdk/clients/s3')

const s3=new S3({
    accessKeyId:process.env.AWS_BUCKET_ACCESS_KEY,
    secretAccessKey:process.env.AWS_BUCKET_SECRET_KEY
})
Router.post('/',async (req,res,next)=>{
    var form=new IncomingForm({multiples:true})
    form.parse(req,(err,fields,files)=>{
        var files_length=files.images.length
        var count=0
        files.images.forEach(async (file,index)=>{
            const file_upload_response=await upload_to_bucket(file)
            if(file_upload_response){
                const image_response=await ImageLinkToDb(fields.placename,file_upload_response.Location)
            }
        })
    })
    next()
})

Router.get('/',async (req,res,next)=>{
    res.end("hmmmm")
})


function upload_to_bucket(file){
    const filecontent=fs.readFileSync(file.filepath)
    const params={
        Bucket:process.env.AWS_IMAGE_BUCKET,
        Body:filecontent,
        Key:file.originalFilename
    }
    return s3.upload(params).promise()
}

function ImageLinkToDb(placename,imagelink){
    return new Promise(async (resolve,reject)=>{
        const new_image=new ImageModel({placename,imagelink})
        const dbresponse=await new_image.save()
        if(dbresponse){
            resolve(true)
        }
        else{
            reject(true)
        }
    })
}

module.exports=Router