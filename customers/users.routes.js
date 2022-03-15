const express=require('express');
 const logincontrollers=require('./userscontrollers');

 var registerRouting=express.Router();

 registerRouting.route('/dump').get(logincontrollers.getUsers);
 registerRouting.route('/login').post(logincontrollers.addUsers);
 registerRouting.route('/get-admin/:id').get(logincontrollers.getId);
 registerRouting.route('/createusers').post(logincontrollers.createUsers);
 registerRouting.route('/getrestaurant').get(logincontrollers.getRestaurant);
 registerRouting.route('/getbookingrestaurant/:id').get(logincontrollers.getRestaurantBookingById);
 registerRouting.route('/getAllUserSpace/:page').get(logincontrollers.getAllUserSpace);
 registerRouting.route('/textSearch/:page/:search').get(logincontrollers.textSearchSpace);



module.exports=registerRouting;