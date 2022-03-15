const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let cofirespaceSchema = new Schema({
    cofirespaceName : String,
    ownerName : String,
    address : String,
    city : String,
    openingTiming : String,
    closingTiming:String,
    contact : Number,
    status: {type:String,default:'not available'},
    ownerId: String,
    rating:Number,
    bookingTime:Array,   
    created_date:{
        type:Date, default:Date
    },
    deleteFlag:{
        type:Boolean,
        default:false
    }
}, {
    collection: 'cofirespace'
})

module.exports = mongoose.model('cofirespaceSchema', cofirespaceSchema)