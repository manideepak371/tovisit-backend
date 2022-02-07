var express=require('express')
const Router=express.Router()
var PlaceController=require('../controllers/placecontroller')


Router.get('/',PlaceController.default)
Router.get('/getPlace',PlaceController.getPlace)

Router.post('/newPlace',PlaceController.addPlace)

module.exports=Router
