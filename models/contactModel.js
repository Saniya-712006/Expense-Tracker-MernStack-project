const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
    name: { type:String , required:true},
    email: {type:String,required:true,unique: true,match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address']},
    message: {type:String,required:true },
});

module.exports=mongoose.model('contactModel',contactSchema);

