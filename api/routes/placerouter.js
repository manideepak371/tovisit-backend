var express=require('express')
const Router=express.Router()
var PlaceController=require('../controllers/placecontroller')
var UserController=require('../controllers/usercontroller')

Router.get('/',PlaceController.default)
Router.get('/getPlace',PlaceController.getPlace)

//User Login & registraion routes

Router.post('/admin/login',UserController.Login)
Router.post('/admin/register',UserController.Register)

//admin controllers to add a new, update an existing place or delete a place

//Router.post('/admin/upload/defaultimage',PlaceController.uploadImages().single('defaultImage'),PlaceController.defaultImage)
Router.post('/admin/addPlace',PlaceController.addPlace)
Router.post('/admin/uploadImage',PlaceController.uploadImages.single('images'),PlaceController.addImagetoDB)
Router.get('/admin/getplaces',PlaceController.getPlaces)
Router.post('/admin/getdetails',PlaceController.getDetails)
Router.post('/admin/updatePlace',PlaceController.uploadImages.single('images'),PlaceController.updatePlace)
Router.post('/admin/uploadUpdatedImage',PlaceController.uploadImages.single('images'),PlaceController.updatedImagetoDB)
Router.post('/admin/deletePlace',PlaceController.deletePlace)

module.exports=Router
