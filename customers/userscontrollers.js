const jwt = require("jsonwebtoken");
var jwtDecode = require('jwt-decode');
const Bcrypt = require('bcryptjs');
let getRestaurantDetails = require('./restaurantdetails.model');
let UsersSchema = require('./users.model');
const pagination=require('../pagination/pagination.controller')
const getcofirespace=require('../cofirespace/cofirespace.model')

var createUsers = function (req, response) {
    console.log('line 10')
    try {
        if(req.body != undefined){
        UsersSchema.countDocuments({ phonenumber: req.body.phonenumber }, (err, data) => {
            if (err) {
                return response.status(500).send(err);
            }
            else if (data > 0) {
               return response.status(200).json({ message: "Already exists" });
            }
            else {
                req.body.password = Bcrypt.hashSync(req.body.password, 10);
                var user = new UsersSchema(req.body);
                user.save();
                console.log(user)
                response.status(200).json({ message: "Successfully created" });
            }
        })
    }
    else {
        response.status(500);
    }
    } catch (error) {
        response.status(500).send(error);
    }
}

var addUsers = function (req, res,next) {
    console.log('hai',req.body.password)
    let getUser;
    UsersSchema.findOne({
        phonenumber: req.body.phonenumber
    }).then(user => {
        if (!user) {
            return res.status(401).json({
                message: "Username is does not exist"
            });
        }
        getUser = user;
        return Bcrypt.compare(req.body.password, user.password);
    }).then(response => {
        if (!response) {
            return res.status(401).json({
                message: "Authentication failed"
            });
        }
        else {
            let jwtToken = jwt.sign({
                userId: getUser._id
            }, "longer-secret-is-better", {
                expiresIn: "1h"
            });
            res.status(200).json({
                token: jwtToken,
                role: getUser.role,
                _id: getUser._id
            });
        }
    }).catch(err => {
        return
    });
}

var getUsers = function (req, res) {
    UsersSchema.find((error, data) => {
        if (error) {
            return next(error)
        } else {
            data = data.filter(res => res.role != 'superadmin');
            res.json(data)
        }
    })
};

var getId = function (req, res, next) {
    UsersSchema.findById(req.params.id, (error, data) => {
        let token = req.headers.authorization;
        var decoded = jwtDecode(token);
        if (error) {
            return next(error);
        }
        if (data.userId === decoded.userId) {
            res.status(200).json(data)
        }
        else {
            res.status(401).json({
                message: "Unauthoraized"
            })
        }
    })
}

var getRestaurant = function (req, res) {
    let token = req.headers.authorization;
    if (token != null) {
        getRestaurantDetails.find((error, data) => {
            if (error) {
                return next(error)
            }
            if (data.length <= 0) {
                return res.status(200).json(
                    { message: "No data found" }
                );
            }
            else {
                return res.status(200).json(data);
            }
        })
    }
    else {
        res.status(401).json({
            message: "Unauthorized"
        })
    }
}

var getRestaurantBookingById = function (req, res, next) {
    let token = req.headers.authorization;
    if (token != null) {
        getRestaurantDetails.findById(req.params.id, (error, data) => {
            if (error) {
                return next(error)
            }
            if (data.length <= 0) {
                return res.status(200).json(
                    { message: "No data found" }
                );
            }
            else {
                res.status(200).json(data);
            }
        })
    }
    else {
        res.status(401).json({
            message: "Unauthorized"
        })
    }
}

var getAllUserSpace=async(req,res)=>{
    const getAllRestaurant=await pagination.paginated(getcofirespace,req.params.page,2,'pageWithLimit',null,res)
    res.status(200).send({success:'true',message:'data successfully fetch',data:getAllRestaurant})
}

var textSearchSpace=async(req,res,err)=>{
    const textSearchSpace=await pagination.paginated(getcofirespace,req.params.page,2,'limitWithTextSearch',req.params.search,res)
    res.status(200).send({success:'true',message:'data fetch successfully',data:textSearchSpace,error:err.message})
}

module.exports = {
    addUsers: addUsers,
    getUsers: getUsers,
    getId: getId,
    createUsers: createUsers,
    getRestaurant: getRestaurant,
    getRestaurantBookingById: getRestaurantBookingById,
    getAllUserSpace:getAllUserSpace,
    textSearchSpace:textSearchSpace
}
