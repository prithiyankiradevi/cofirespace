const mongoose = require('mongoose');
const logincontrollers=require('./logincontrollers');
const Schema = mongoose.Schema;

let loginSchema = new Schema({
    username : String,
    contact : Number,
    email : String,
    password: String,
    role:{
        type:String, 
        default:'superadmin'
    }
}, {
    collection: 'login'
})

module.exports = mongoose.model('LoginSchema', loginSchema)