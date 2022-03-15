var jwtDecode = require('jwt-decode');
let booking = require('./booking.model');
let restaurant = require('../restaurant/adminrestaurant.model');
const res = require('express/lib/response');

var createBookingSlot = function (req, response) {
    try {
        let token = req.headers.authorization;
        if(token != null){
        var decoded = jwtDecode(token);
        req.body.userId = decoded.userId;
        var bookingTable = new booking(req.body);
        bookingTable.save();
        response.status(200).json({ message: "Booking Successfully" });
    }
    else {
        response.status(401).json({ message: "Unauthoraized" });
    }
    } catch (error) {
        response.status(500).send(error);
    }
}

var getBookingSlot = function async(req, response) {
    try {
        let token = req.headers.authorization;
        if(token != null){
        var decoded = jwtDecode(token);
       const data=await  booking.aggregate([{$match:{userId:decoded.userId}}])
       if(data){
           response.status(200).send({data:data})
       }else{
           response.status(400).send({message:data})
       }
    }
    else {
        response.status(401).json({ message: "Unauthoraized" });
    }
    } catch (error) {
        response.status(500).send(error);
    }
}

module.exports = {
    createBookingSlot: createBookingSlot,
    getBookingSlot: getBookingSlot
}