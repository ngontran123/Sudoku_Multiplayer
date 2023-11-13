import {user} from "../models/user_model"
const jwt=require('jsonwebtoken');
const config=require('./auth');
var token_checking=(req,res,next)=>{
 var token=req.query.token;
 if(!token)
 {  return res.status(401).send({message:"No token is provided"});
 }
 jwt.verify(token,config.secret,(err,decoded)=>{
  if(err)
  { 
    return res.status(401).send({message:"Unauthorized"});
  }
  req.userId=decoded.id;
  next();
 }) 
}

var email_token_checking=(req,res,next)=>{
  var email_token=req.query.token;
  if(!email_token)
  {
    return res.status(401).send({message:'Không tìm thấy token'});
  }

 try{
   var decoded_token=jwt.verify(email_token,config.secret);
   if(decoded_token)
   {
     var token_expire_time=decoded_token.exp;
     var datetime_now=new Date();
     var datetime_epoch=datetime_now.getTime()/1000;
     if(token_expire_time<datetime_epoch)
     {  
        var expired_link='http://localhost:3000/expired_token';
        res.redirect(301,expired_link);
     }
   }
   next();
}
catch(error)
{                                                     
    var expired_link='http://localhost:3000/expired_token';
    res.redirect(expired_link);
}
}
export {token_checking,email_token_checking};
