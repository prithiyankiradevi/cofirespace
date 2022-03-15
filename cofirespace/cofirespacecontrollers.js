var jwtDecode = require('jwt-decode');

let getcofirespace = require('./cofirespace.model');
// let LoginSchema = require('../Login/login.model');
// let pagination=require('../pagination/pagination.controller');
const { default: mongoose } = require('mongoose');

var addSpace = function (req, res) {
    try{
        let token = req.headers.authorization;
    if (token != null) {
    var decoded = jwtDecode(token);
    req.body['ownerId'] = decoded.userId;
    getcofirespace.create(req.body, (error, data) => {
        if(data){
            res.status(200).send({success:'true',message:'created successfully',data:data})
        }else{
            res.status(400).send({success:'false',message:"doesn't created properly",data:[]})
        }
    });
    }else {
        res.status(400).json({success:'false',message: "Unauthorized"})
    }
    }catch(e){
        res.status(500).send({message:'internal server error'})
    }
}  

var getSpaceByOwner = async function (req, res) {
    try{

    }catch(e){
        res.status(500).send({message:'internal server error'})
    }
    let token = req.headers.authorization;
    var decoded = jwtDecode(token);
    const data=await getcofirespace.aggregate([{$match:{ownerId:decoded.userId,deleteFlag:"false"}}])
        if(data.length!=0){
            if(JSON.stringify(decoded.userId)===JSON.stringify(data[0].ownerId)){
                res.status(200).json({data:data});
            }else{
                res.status(200).send({message:'unauthorized'})
            } 
        }else{    
            res.status(400).send(data=[])
        }
}

var getSpaceById = async function (req, res) {
    try{
        if(req.headers.authorization){
            let token = req.headers.authorization;
            var decoded = jwtDecode(token);
            const data=await getcofirespace.cofirespace.aggregate([{$match:{_id:mongoose.Types.ObjectId(req.params.id),deleteFlag:false}}])
            if(data.length!=0){
                if(decoded.userId===data.ownerId){
                    res.status(200).send({data:data})
                }else{
                    res.status(200).send({message:'unauthorized'})
                }
            }else{
                res.status(400).send({data:[]})
            }
        }
        else {
            res.status(401).json({
                message: "please provide token"
            })
        }
    }catch(e){
        res.status(500).send({message:"internal server error"})
    }
}

var updateSpaceDetails = function (req, res) {
    try{
        if(req.headers.authorization){
            let token = req.headers.authorization;
            var decoded = jwtDecode(token);
            getcofirespace.cofirespace.findByIdAndUpdate({ _id: req.params.id },
                { $set: req.body },
                { new: true },(err,result)=>{
                    if(result){
                        if(decoded.userId===result.ownerId){
                            res.status(200).send({message:data})
                        }else{
                            res.status(200).send({message:'unauthorized'})
                        }
                    }else{
                        res.status(400).send({data:[]})
                    }
                })
            }
        else {
            res.status(401).json({
                message: "please provide token"
            })
        }
    }catch(e){
        res.status(500).send({message:'internal server error'})
    }
}

var statusUpdate = function (req, res){
    try{

    }catch(e){
        res.status(500).send({message:'internal server error'})
    }
    getcofirespace.findById(req.body.id, (error, data) => {
        if (error) throw error
        data.status = req.body.status;
        getcofirespace.cofirespace.findByIdAndUpdate(req.body.id, { $set: data }, (err, response) => {
            if (err) throw err
             else {
                res.json(response)
            }
        })
    })
}

var spaceTimeUpdate =async function(req,res){
    try{
        let token = req.headers.authorization;
        if(token != null) {
            const data=await getcofirespace.aggregate([{$match:{_id:mongoose.Types.ObjectId(req.params.id)}},{$project:{rating:1,_id:0}}])
            console.log(data)
        //     .findById(req.body._id, (error, data) => {
        //         if (error) throw error
        //         data.bookingTime = req.body.bookingTime;
        //     getcofirespace.cofirespace.findByIdAndUpdate(req.body._id, { $set: data },{new:true}, (err, response) => {
        //         if (err) {
        //             return next(err)
        //         } else {
        //             res.json(response)
        //         }
        //     });
        // })
        }
        else {
            res.status(401).json({
                message: "Unauthorized"
            })
        }
    }catch(e){
        res.status(500).send({message:'internal server error'})
    }
}

var getSpaceByRating=async(req,res)=>{
    try{
        const data=await getcofirespace.aggregate([{$match:{rating:req.body.rating}}])
        if(data){
            res.status(400).send({sucess:'true',message:'data fetched successfully',data:data})
        }else{
            res.status(400).send({sucess:'false',message:'failed',data:[]})
        }
    }catch(e){
        // console.log(e.message)
        res.status(500).send({message:'internal server error'})
    }
}




module.exports = {
    addSpace: addSpace,
    getSpaceByOwner:getSpaceByOwner,
    getSpaceById: getSpaceById,
    updateSpaceDetails:updateSpaceDetails,
    statusUpdate:statusUpdate,
    spaceTimeUpdate:spaceTimeUpdate,
    getSpaceByRating:getSpaceByRating
}