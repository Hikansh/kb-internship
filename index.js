const express=require('express');
const bodyParser=require('body-parser');
const jwt=require('jsonwebtoken');
const User=require('./models/user')
const Order=require('./models/order')
const Product=require('./models/catalogue')
const mongoose=require('mongoose');
const db="mongodb://hikansh:hikansh1998@ds261114.mlab.com:61114/kb_db_assignment"


const app=express();
const PORT=3000;
app.use(bodyParser.json());

mongoose.connect(db,(err)=>{
    if(err){
        console.log(err);
    }
    else{
        console.log('Connected to MONGODB');
    }
})

app.listen(PORT, () => {
    console.log('App listening on port '+PORT);
});

     function tokenAuthentication(req,res,next){
        const bHeader=req.headers['authorization'];
        if(typeof bHeader!=='undefined'){
            const bearer=bHeader.split(' ');
            const bearerToken=bearer[1];
            req.token=bearerToken;
            next();
        }
        else{
            res.sendStatus(403);
        }
    }

    function verifyAdminRoute(req,res,next) {
        if(req.body.adminId=="12345"){
            next();
        }
        else{
            res.sendStatus(403);
        }
    }

app.get('/api', (req, res) => {
    res.json({
        message:"Welcome New User..!"
    })
});

app.post('/signup', (req, res) => {
    let userData=req.body;
    var phoneno = /^\d{10}$/;
    if(userData.mob.match(phoneno)){
    User.find({mobileNumber:userData.mob})
        .exec()
            .then(user=>{
                if(user.length>=1){
                    return res.status(409).json({
                        message:'Number already exists'
                    })
                }
                else{
                    let user=new User({
                        _id:new mongoose.Types.ObjectId(),
                        mobileNumber:userData.mob,
                        password:userData.password,
                        isDriver:userData.isDriver
                    });
                    user.save()
                        .then(result=>{ 
                            console.log(result);            
                            res.status(201).json({
                                message:'User created..!'
                            })
                        })
                }
            })
        }
        else{
            res.json({
                message:'Invalid Phone number'
            })
        }
});

app.post('/login', (req, res) => {
    let userData=req.body;
    let mob=userData.mob;
    let pwd=userData.password;
    User.findOne({mobileNumber:mob},(err,user)=>{
        if(err) throw(err);
        if(!user){
           return res.status(402).json({
                message:"User not found..!"
            })
        }
            console.log(user);
            console.log(pwd);
            if(user.password==pwd){
                jwt.sign({user:user},'secretkey',(err,token)=>{
                    res.json({
                        token:token,
                        message:"Login Successfull..!"
                    })
                })
            }
            else{
                res.json({
                    message:"Invalid Password..!"
                })
            }
    })
        });



    app.post('/order',tokenAuthentication, (req, res) => {
        jwt.verify(req.token,'secretkey',(err,authData)=>{
            if(err){
                res.sendStatus(403);
            }
                else{
                    let locs=["A","B","C"];
                    let loc=locs[Math.floor(Math.random()*locs.length)]
                    let order=new Order({
                        order_id:new mongoose.Types.ObjectId(),
                        customer_id:req.body.customer_id,
                        driver_id:null,
                        order_stage:"Task Created",
                        items:req.body.order,
                        location:loc
                    })
                    order.save()
                        .then(order=>{
                            console.log(order);                            
                            res.json({
                                message:"Order created..!"
                            });
                        })                        
            }
        })   
        });

        app.post('/add-product', (req, res) => {
            let product=new Product({
                productName:req.body.name,
                category:req.body.category,
                locations:req.body.locations
            })
            Product.findOne({productName:req.body.name},(err,prod)=>{
                if(!prod){
                    let product=new Product({
                        productName:req.body.name,
                        category:req.body.category,
                        locations:req.body.locations
                    })
                    product.save()
                            .then(prod=>{
                                console.log(prod);
                                res.json({
                                    message:"New product added to catalogue..!"
                                })
                            })      
                }
                else{
                    res.json({
                        message:"Product already in DB"
                    })
                }
            })
        });

        app.post('/admin/orders',verifyAdminRoute ,(req, res) => {
            Order.find({},(err,orders)=>{
                if(err) console.log(err);
                res.json({
                    orders:orders
                })
            })
        });

        app.post('/admin/drivers/show', verifyAdminRoute,(req, res) => {
            User.find({isDriver:true},(err,users)=>{
                if(err) console.log(err);
                res.json({
                    users:users
                })
            })
        });
        
        app.post('/assign-to-order', verifyAdminRoute,(req, res) => {
            let oid=req.body.oid;
            let driverId=req.body.did;
            Order.findOne({order_id:oid},(err,order)=>{
                if(order){
                    order.driver_id=driverId;
                    order.save()
                    .then(order=>{
                        console.log(order);
                        res.json({
                            message:"Driver Assigned..!"
                        })    
                    })
                }
            })
        });

        app.post('/driver/orders', (req, res) => {
            Order.findOne({driver_id:req.body.id},(err,orders)=>{
                if(err) console.log(err);
                if(orders){
                    res.json({
                        orders:orders
                    })
                }
                else{
                    res.json({
                        message:"No orders for you till date..!"
                    })
                }
            })
        });

        app.post('/driver/update-order', (req, res) => {
            let did=req.body.did;
            let oid=req.body.oid;
            Order.findOne({order_id:oid,driver_id:did},(err,order)=>{
                order.order_stage=req.body.update_stage;
                order.save()
                .then(order=>{
                    console.log(order);
                    res.json({
                        message:"Order stage updated as you said..!"
                    })
                })
            })
        });