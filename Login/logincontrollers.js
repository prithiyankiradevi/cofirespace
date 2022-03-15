const jwt = require("jsonwebtoken");
var jwtDecode = require('jwt-decode');
const Bcrypt = require('bcryptjs');

let LoginSchema = require('./login.model');

var createAdmin = function (req, response, next) {
    try {
        console.log('hai')
        LoginSchema.countDocuments({ username: req.body.username }, (err, data) => {
            if (err) {
                return next(err);
            }
            if (data === 0) {
                req.body.password = Bcrypt.hashSync(req.body.password, 10);
                var user = new LoginSchema(req.body);
                user.save();
                console.log(user)
                return response.status(200).json({ message: "Successfully created" });
            }
            else {
                    LoginSchema.findById(req.body.id, (error, res) => {
                        if(res){
                        if (decoded.userId === res.userId) {
                            LoginSchema.findByIdAndUpdate(req.body.id, { $set: req.body }, (err, data) => {
                                response.status(200).json({ message: "Successfully updated" });
                            })
                        }
                        else {
                            return response.status(401).json({
                                message: "Authentication failed"
                            });
                        }
                    }
                    else {
                        return response.status(200).json({
                            message: "Already exists"
                        });
                    }
                    })
            }
        })
    } catch (error) {
        console.log(error.message)
        res.status(500).send(error);
    }
}


var addUsers = function (req, res) {
    let getUser;
    LoginSchema.findOne({
        username: req.body.username
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
            }, "longer-secret-is-better");
            console.log(jwtToken)
            res.status(200).json({
                token: jwtToken,
                role: getUser.role,
                _id: getUser._id
            });
        }
    }).catch(err => {
        return err
    });
}

var getUsers = function (req, res) {
    LoginSchema.find((error, data) => {
        if (error) {
            return next(error)
        } else {
            data = data.filter(res => res.role != 'superadmin');
            res.json(data)
        }
    })
};

var getId = function (req, res, next) {
    LoginSchema.findById(req.params.id, (error, data) => {
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


module.exports = {
    addUsers: addUsers,
    getUsers: getUsers,
    getId: getId,
    createAdmin: createAdmin
}