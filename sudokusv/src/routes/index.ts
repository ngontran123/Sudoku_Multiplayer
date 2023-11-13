import * as express from 'express'
import {user,room_user,user_room_detail} from '../models/user_model';
import checkingDuplicateUserNameOrEmail from '../config/checking';
import {token_checking,email_token_checking} from '../config/checkingToken';
import {username,password,registerUrl,loginUrl,registerServerUrl} from './gmail_account';
import { DateTime } from 'luxon';
var router = express.Router();
var config=require('../config/auth');
var jwt=require('jsonwebtoken');
var nodemailer=require('nodemailer');
/* GET home page. */
const bcrypt=require('bcrypt');
const crypto=require('crypto');
const uuid=require('uuid');
const transportEmail=nodemailer.createTransport({
    service:'gmail',
    auth:{
      user:username,
      pass:password
    }
  });
  const getIdGameLevel=(level:string)=>
  {
    var id_level=0;
    switch(level)
    {
      case 'Easy':id_level=1;break;
      case 'Medium':id_level=2;break;
      case 'Hard':id_level=3;break;
      case 'Extreme':id_level=4;break;
    }
    return id_level;
  }
const hbs=require('nodemailer-express-handlebars');
const path=require('path');
const handlebarsOption={
    viewEngine :{
        partialsDir: path.resolve('../sudokusv/src/views/'),
        defaultLayout: false,
    },
    viewPath:path.resolve('../sudokusv/src/views/')
};

transportEmail.use('compile',hbs(handlebarsOption));
 router.post('/verify',checkingDuplicateUserNameOrEmail,function(req,res,next){
    var new_user=req.body;
    let email_payload=
    {
      username:new_user.username,
      email:new_user.email
    };

    let email_token=jwt.sign(email_payload,config.secret,{expiresIn:300});
    console.log(email_token);
    console.log('verify:'+new_user.username+' '+new_user.password+' '+new_user.gender+' '+new_user.email);    
    const emailContentConfig={
        from:'huynhkiengquan@gmail.com',
        template:'email_template',
        to:new_user.email,
        subject:'Email verification',
        context:{
            username:new_user.username,
            link:`${registerServerUrl}?username=${new_user.username}&password=${encodeURIComponent(new_user.password)}&gender=${new_user.gender}&email=${new_user.email}&token=${encodeURIComponent(email_token)}`
        }
       };
       transportEmail.sendMail(emailContentConfig,(error,info)=>{
        if(error)
        {  
           throw Error(error);
        }
        console.log("Send mail successfully:"+info);
       });
       res.status(200).send({'message':'Vui lòng vào email của bạn để xác thực tài khoản.'});
 });

router.post('/register',email_token_checking,function(req, res, next) {
   const new_user={
    username:'',
    password:'',
    gender:'',
    email:'',
    avatar:'',
    created_date:'',
    display_name:'',
    motto:''
   };
   new_user.username=req.query.username;
   new_user.password=bcrypt.hashSync(req.query.password,8);
   new_user.gender=req.query.gender;
   new_user.email=req.query.email;
   new_user.avatar='https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png';
   new_user.created_date=DateTime.now().toLocaleString(DateTime.DATE_FULL);
   new_user.display_name=req.query.username;
   console.log('register:'+new_user.username+' '+new_user.password+' '+new_user.gender+' '+new_user.email);
   if(new_user.username==='' || new_user.password===''||new_user.gender===''||new_user.email==='')
   {
    res.redirect(301,`${loginUrl}?email=${new_user.email}`);
   }
   else{
   const register_user=new user(new_user);
   try{
    register_user.save((err,doc)=>{
        if(err)
        {
            return console.error(err);
        }
        res.redirect(301,`${loginUrl}?email=${new_user.email}`);
    });
    console.log(new_user);
   }
   catch(error)
   {
    res.status(404).json({message:error});
   }
}
}
);

router.get('/login',function(req,res,next){
    try{
        var email=req.query.email;
        user.findOne({email:email}).exec((err,user_valid)=>{
         if(err)
         {
            throw err
         }
         if(user_valid)
         {
            res.status(201).send({message:"Đã đăng ký thành công"});
         }
         else{
            res.status(409).send({message:"Đăng ký thất bại."});
         }
        });
    }
    catch(error)
    {
    res.status(404).json({message:error});
    }
});
  
router.post('/login',function (req,res,next){
    user.findOne({username:req.body.username}).exec((err,userr)=>{
        if(err)
        {    
            console.log("Error while fetching user");
            return;
        }
        if(!userr)
        {  return res.send({message:"Username do not exist"});
        }
    var passwordIsValid=bcrypt.compareSync(req.body.password,userr.password);
    if(!passwordIsValid)
    {  
        return res.send({message:"Password is invalid"});
    }
    const jwt_payload={
        user_id:userr.id,
        username:userr.username
    }
    var token=jwt.sign(jwt_payload,config.secret,{expiresIn:'1h'});
    req.session.token=token;
    return res.status(200).send({message:"",token:req.session.token,username:userr.username,email:userr.email});
    })
});
router.post('/auth/verify',function(req,res,next){
    try{
    let token=req.body.token;
    let decoded_token=jwt.verify(token,config.secret);
    console.log(decoded_token);
    user.findOne({username:decoded_token.username}).exec((err,userr)=>{
   if(err)
   {
    throw err;
   }
   if(userr)
   {console.log('display_user:'+userr.display_name);
    res.status(200).send({message:userr});
   }
   else{
    res.send({message:'Invalid'});
   }
    });
}
catch(error)
{
    console.log('There is '+error+' during the process.');
}
});

router.get('/join',token_checking,function(req,res,next){
    return res.status(200).send({user:''});
});

router.get('/hall',token_checking,function(req,res,next){
  return res.status(200).send({user:''});
});

router.get('/level',token_checking,function(req,res,next){
 return res.status(200).send();
});

router.get('/user_profile/:username',token_checking,function(req,res,next)
{
     try
     {
      var user_name=req.params.username;
      if(user_name.trim()!="" && user_name!=null)
      {
        user.findOne({username:user_name}).exec((err,user)=>{
          if(err)
          {
            console.log("error:"+err);
            throw err;
          }
         if(!user)
         {
            res.status(404).send({message:'Không tìm thấy user này'});
         }
        else{
            res.status(200).send({message:'OK'});
        }
        });
      }
     }
     catch(error)
     {
        throw error;
     }
     
});
const delay=ms=>new Promise(rs=>setTimeout(rs,ms));

const get_statistic_by_level=async(username:string,level:string)=>
{
try
{
 var username=username; 
    var user_exist=await user.findOne({username:username});
    var user_id=user_exist._id;
    var list_res=[];
    var room_handle=await room_user.aggregate([
      {
          $group:{
            _id:"$_id",
            "level_push":{$push:"$level_id"}
          }
      },
      {
         $match:
         {
             "level_push":
             {
              $all:[getIdGameLevel(level)]
             }
         }
      }
    ]).exec((err,db)=>{
      if(err)
      {
        throw(err);
      }
      var num=db.length;
      if(num>0)
      { 
        var rooms=[];
        for(let i=0;i<num;i++)
        {
         rooms.push(db[i]._id);
        }
        var count_win=user_room_detail.countDocuments({
          status:"Win",
          user_id:user_id,
          room_id:{$in:rooms},
        },(err,count)=>{
          var num_lose=rooms.length-count;
          list_res.push(count,num_lose);
          return list_res;
        });
      }
      else
      {
       list_res.push(0,0);
       return list_res;
      }
    });
    while(list_res.length==0)
    {
      await delay(100);
    }
    return list_res;
}
catch(err)
{
  console.log(err);
}
}

router.get('/statistics/:username',token_checking,async function(req,res,next)
{
  try
  {
   var username=req.params.username;
   console.log(username);
   var list_easy=await get_statistic_by_level(username,'Easy');
   var list_medium=await get_statistic_by_level(username,'Medium');
   var list_hard=await get_statistic_by_level(username,'Hard');
   var list_extreme=await get_statistic_by_level(username,'Extreme');
   console.log('Easy'+" "+list_easy);
   console.log('Medium'+" "+list_medium);
   console.log('Hard'+" "+list_hard);
   console.log('Extreme'+" "+list_extreme);

   res.status(200).send({easy_win:list_easy[0],easy_lose:list_easy[1],medium_win:list_medium[0],medium_lose:list_medium[1],hard_win:list_hard[0],hard_lose:list_hard[1],extreme_win:list_extreme[0],extreme_lose:list_extreme[1]});
  }
  catch(err)
  {
    console.log("Statistic error:"+err);
  }
});

router.post('/auth',token_checking,function(req,res,next){
   res.status(200).send({message:'OK'});
});

router.put('/user_detail/:username',token_checking,async function(req,res,next)
{
 try{
    var data=req.body;
    console.log("motto:"+data.motto);
    console.log("display_name:"+data.display_name);
    if(username.trim()!="" && username!=null)
    {  
    await user.updateOne(
        {username:data.username},
        {$set:{display_name:data.display_name,
            motto:data.motto,
            avatar:data.avatar,
            gender:data.gender}}
    );
    user.findOne({username:data.username}).exec((err,user)=>
    {  if(user)
        {
     res.status(200).send({message:user});  
        }
    });
}
 }
 catch(err)
 {  res.status(404).send({message:"Cập nhật dữ liệu thất bại:"+err.toString()});
    throw err;
 }
});

router.post('/user_detail/:username',token_checking,function(req,res,next)
{
  try
  { 
    var token=uuid.v4();
    var current_time=Date.now();
    var expire=(current_time/1000)+2400;
    var signature=crypto.createHmac('sha1','private_/h5OYTyHT+iEuJ9X4d4SXbe6w4E=').update(token+expire).digest('hex');
    res.set({
        "Access-Control-Allow-Origin" : "*"
    });
    res.status(200).send({token:token,expire:expire,signature:signature});
  }
  catch(err)
  {
    throw err;
  }
});
router.get('/user_detail/:username',token_checking,function(req,res,next)
{
 try
 {  
    var user_name=req.params.username;
    if(user_name.trim()!="" && user_name!=null)
      {
        user.findOne({username:user_name}).exec((err,user)=>{
          if(err)
          {
            console.log("error:"+err);
            throw err;
          }
         if(!user)
        {
            res.status(404).send({message:'Không tìm thấy user này'});
        }
        else
        {
            res.status(200).send({message:'OK'});
        }
        });
      }
 }
 catch(err)
 {
   console.log("error:"+err);
 }
});

router.get('/waiting_room/:room_name',token_checking,function(req,res,next)
{
     try
     {
    var room_name=req.params.room_name;
    console.log("room_name is:"+room_name);
    res.status(200).send({room_name:room_name});
     }
     catch(err)
     {  
        throw err;
     }
});

router.get('/match/:room_name',token_checking,function(req,res,next)
{
try
{
  var room_name=req.params.room_name;
  console.log("room_name is:"+room_name);
  res.status(200).send({room_name:room_name});
}
catch(err)
{
  throw err;
}
});
module.exports = router;
