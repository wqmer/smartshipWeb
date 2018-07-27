import mongoose from 'mongoose'

var balance =  new mongoose.Schema({
    name:String ,
    amount:Number
}, { versionKey: false });

module.exports =  mongoose.model('balance',balance,'balance');