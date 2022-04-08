var express=require('express')
const Router=express.Router()
var PlaceController=require('../controllers/placecontroller')
var UserController=require('../controllers/usercontroller')

Router.get('/',PlaceController.default)
Router.get('/getPlace',PlaceController.getPlace)
Router.post('/newPlace',PlaceController.addPlace)
Router.get('/places/getplaces',PlaceController.getPlaces)
Router.post('/places/getimages',PlaceController.getImages)
Router.post('/places/getdetails',PlaceController.getDetails)

module.exports=Router
