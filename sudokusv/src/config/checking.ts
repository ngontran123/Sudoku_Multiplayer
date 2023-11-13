
import {user} from "../models/user_model";
var checkingDuplicateUserNameOrEmail=(req,res,next)=>{
    user.findOne({username:req.body.username}).exec((err,userr)=>{
        if(err)
        {
           throw err;
        }
        if(userr)
        {   console.log(req.body.username);
           return res.status(409).send({message:"Tên đăng nhập này đã được sử dụng"});
        }
        else{
            user.findOne({email:req.body.email}).exec((err,email)=>{
                if(err)
                {
                    throw err;
                }
                if(email)
                {     
                  console.log(req.body.email);
                  return res.status(409).send({message:"Email này đã được sử dụng."});
                }
                else{
                next();
                }
            });
        }
    });


   
}

export default checkingDuplicateUserNameOrEmail;