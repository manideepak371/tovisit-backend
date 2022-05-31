var express=require('express')
const Router=express.Router()
var PlaceController=require('../controllers/placecontroller')

Router.get('/',PlaceController.default)
Router.get('/getPlace',PlaceController.getPlace)
Router.post('/admin/addPlace',PlaceController.addPlace)
Router.post('/admin/uploadImage',PlaceController.uploadImages.single('images'),PlaceController.addImagetoDB)
Router.get('/getplaces',PlaceController.getPlaces)
Router.post('/getdetails',PlaceController.getDetails)
Router.post('/admin/updatePlace',PlaceController.uploadImages.single('images'),PlaceController.updatePlace)


module.exports=Router
