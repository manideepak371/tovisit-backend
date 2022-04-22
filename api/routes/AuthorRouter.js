const { ObjectID } = require('bson')
const { ObjectId } = require('mongodb')
const { Types, Mongoose } = require('mongoose')
const { AuthorModel, StoryModel } = require('../models/TestSchema')

const Router=require('express').Router()

Router.post('/insert',async (req,res,next)=>{
    const {author,stories}=req.body
    const Author=new AuthorModel({author})
    const storyset=stories.map((story)=>{
        story.author=Author._id
        return story
    })
    storyset.forEach(story => {
        const newStory=new StoryModel(story)
        newStory.save() 
        Author.stories.push(newStory)
    });
    Author.save()
    res.end("sent")
})

Router.get('/select',async (req,res,next)=>{
    const dbresponse=await AuthorModel.findOne({author:"Nene"}).populate("stories")
    res.json(dbresponse)
})

module.exports=Router