const express=require('express');
 const cofirespacecontrollers=require('./cofirespacecontrollers');

 var cofirespaceRouting=express.Router();

//  cofirespaceRouting.route('/getcofirespace').get(cofirespacecontrollers.getcofirespace);
//  cofirespaceRouting.route('/updatestatus').post(cofirespacecontrollers.statusUpdate);
 cofirespaceRouting.route('/addcofirespace').post(cofirespacecontrollers.addSpace);
 cofirespaceRouting.route('/getcofirespace/:id').get(cofirespacecontrollers.getSpaceById);
 cofirespaceRouting.route('/getSpaceByOwner').get(cofirespacecontrollers.getSpaceByOwner);
 cofirespaceRouting.route('/getSpaceUsingRating').post(cofirespacecontrollers.getSpaceByRating)
 cofirespaceRouting.route('/updateSpaceTime/:id').get(cofirespacecontrollers.spaceTimeUpdate)



//  cofirespaceRouting.route('/updatecofirespace').post(cofirespacecontrollers.cofirespaceUpdate);
//  cofirespaceRouting.route('/getadmincofirespace').get(cofirespacecontrollers.getAdmincofirespace);
//  cofirespaceRouting.route('/updateadmincofirespace').post(cofirespacecontrollers.updateAdmincofirespace);
//  cofirespaceRouting.route('/getallcofirespace').get(cofirespacecontrollers.getAllRestaurant);
//  cofirespaceRouting.route('/getadmincofirespace/:id').get(cofirespacecontrollers.getAdmincofirespaceById);
//  cofirespaceRouting.route('/cofirespacetime').post(cofirespacecontrollers.cofirespaceTimeUpate);

module.exports=cofirespaceRouting;