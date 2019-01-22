const mongoose=require('mongoose');

const Schema=mongoose.Schema
const userSchema=new Schema({
    _id:mongoose.Schema.Types.ObjectId,
    mobileNumber:{type:String,required:true},
    password:{type:String,required:true},
    isDriver:{type:Boolean,default:false}
})

module.exports=mongoose.model('user',userSchema,'users');  //model name,schema name,collection name in mlab