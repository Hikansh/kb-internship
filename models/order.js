const mongoose=require('mongoose');

const Schema=mongoose.Schema
const orderSchema=new Schema({
    order_id:mongoose.Schema.Types.ObjectId,
    customer_id:{type:mongoose.Schema.Types.ObjectId,default:null},
    driver_id:{type:mongoose.Schema.Types.ObjectId,default:null},
    order_stage:{type:String,default:"Task Created"},
    items:JSON,
    location:String
})

module.exports=mongoose.model('order',orderSchema,'orders');  //model name,schema name,collection name in mlab