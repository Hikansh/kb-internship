const mongoose=require('mongoose');

const Schema=mongoose.Schema
const catalogueSchema=new Schema({
    productName:{type:String,required:true},
    category:{type:String,required:true},
    locations:{type:Array,required:true},
})

module.exports=mongoose.model('catalogue',catalogueSchema,'catalogue');  //model name,schema name,collection name in mlab