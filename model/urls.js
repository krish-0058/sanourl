const mongoose = require("mongoose")

const urlSchema = new mongoose.Schema({
    originalUrl:{
        type:String,
    },
    shortCode:{
        type:String,
        unique:true
    },
    createdAt:{
        type:Date,
        default:Date.now
    }
})

 
const url = mongoose.model("urls",urlSchema)

module.exports = {url}