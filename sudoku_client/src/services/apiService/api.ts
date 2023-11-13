import axios from "axios";
import {useNavigate,useParams,useSearchParams,useLocation} from "react-router-dom";
import { useRef, useContext } from 'react';
import gameContext from "../../gameContext";
import {useEffect} from 'react';
import { AlertCheckDialog,AlertErrorDialog,AlertQuestionDialog,AlertWarningDialog } from "../../components/dialogbox";
const URL='http://localhost:9000';
const list=[];
const populate_list=(data)=>{list.push(data)};
const addUser=async (data) =>{
    try{
    return await axios.post(`${URL}/verify`,data).then((res)=>{
        let response_data=res.data.message;
        AlertCheckDialog(res.data.message,'Gửi email thành công');
    });
    }
    catch(error)
    {   if(error.response.status===409)
        {
            AlertErrorDialog(error.response.data.message,'Thông tin đã tồn tại');
        }
        console.log('There is '+error.message+' in the process');
    }
}
const getUserRegisterRes=(isChecked)=>{
   if(!isChecked)
   {
    try
   {
    const path=window.location.href;
    if(path.includes("?"))
    {
    var email=path.split('?');
    var email_value=email[1].split('=')[1];
    return axios.get(`${URL}/login`,{params:{email:email_value}}).then((res)=>{
   let response_data=res.data.message;
    AlertCheckDialog(response_data,"Đăng ký thành công");
});
    }
    else{
        return;
    }
    
   }
   catch(error)
   { if(error.response.status===409)
    {
        AlertErrorDialog(error.response.data.message,'Lỗi đăng ký');
    }
    console.log('There is'+error.message+' in the process');
   }
}
else{
    return;
}
}
const loginUser=async(data)=>
   {                         
    try{
     return await axios.post(`${URL}/login`,data).then(async(res)=>{
       if(res.data.message!=='')
       {
           AlertErrorDialog(res.data.message,'Đăng nhập thất bại');
       }
       else{
       let verify_data={
        token:res.data.token,
        username:res.data.username
       };
       let is_valid_token=await verifyToken(verify_data);
       if(is_valid_token.status===200)
       {
        var tokenNizer=
        {
           token:res.data.token
        }
        localStorage.setItem('current_user',JSON.stringify(is_valid_token.data.message));
        list.push(res.data.email);
        list.push(res.data.username);
        list.push(res.data.token);
        localStorage.setItem('token',res.data.token);
        await joiningHall(tokenNizer);
       }
       else
       {
        AlertErrorDialog(res.data.message,'Token không hợp lệ');    
       }
    }
     });
    }
    catch(error)
    {
        console.log('There is '+error.message+' in the process');
    }
}
const verifyToken=async(data)=>{
    try{
   return await axios.post(`${URL}/auth/verify`,data).then((res)=>{
      return res;
   });
       }
    catch(error)
    {    if(error.response.status===401)
        {   localStorage.setItem('token','');
            AlertWarningDialog("Token đã hết phiên làm việc.Hãy đăng nhập lại","Token hết hạn");
            window.location.assign('/login');
        }
         throw error;
    }
}

const joiningHall=async(token)=>{
    try
    {
    return await axios.get(`${URL}/hall`,{params:{'token':token.token}}).then((res)=>{
        if(res.status===200)
        {
            window.location.assign('/hall');
        }
    })
    }
    catch(err)
    {
        if(err.response.status===401)
        {
            window.location.assign('http://localhost:3000/login');
            localStorage.removeItem('token');
        }
    }
}

const joiningLevelPicker=async(token)=>{
    try
    {
    return await axios.get(`${URL}/hall`,{params:{'token':token.token}}).then((res)=>{
        if(res.status===200)
        {
            window.location.assign('/level');
        }
    })
    }
    catch(err)
    {
        if(err.response.status===401)
        {
            window.location.assign('http://localhost:3000/login');
            localStorage.removeItem('token');
        }
    }
}

const joiningRoom=async(token)=>{
    try{
          return await axios.get(`${URL}/join`,{params:{'token':token.token}}).then((res)=>{
            if(res.status===200)
            {   
                window.location.assign('/join');
            }
          });
    }
    catch(error)
    {   if(error.response.status===401)
        {
            window.location.assign('http://localhost:3000/login');
            localStorage.removeItem('token');
        }
        console.log('There is '+error+' in the process');
    }
}

const userInfo=async(token,username)=>{
    try
    { console.log("click here");
      return await axios.get(`${URL}/user_profile/${username}`,{params:{'token':token}}).then((res)=>{
        if(res.status===200)
        {   
             window.location.assign(`/user_profile/${username}`);     
        }
      }); 
    }
    catch(error)
    {   if(error.response.status===404)
        {
         AlertErrorDialog("Không tìm thấy thông tin user này","Không tìm thấy user");
        }
        else if(error.response.status===401)
        {
            localStorage.removeItem('token');
            window.location.assign('http://localhost:3000/login');
        }
        console.log('There is '+error+' in the process');
        throw error;
    }
}

const userDetail=async(token,username,data)=>
{
 try
 {
  return await axios.put(`${URL}/user_detail/${username}?token=${token}`,data).then((res)=>{
       if(res.status===200)
       {
      localStorage.removeItem('current_user');
      localStorage.setItem('current_user',JSON.stringify(res.data.message));
      AlertCheckDialog("Đã cập nhật thông tin thành công.","Cập nhật thông tin");
      return res.status;
       }
  });
 }
 catch(error)
 {
   if(error.response.status===404 || error.response.status===401)
   {
    AlertErrorDialog(error.response.data.message,"Cập nhật thông tin");
   }
 }
}
const getUserDetail=async(token,username)=>
{
try{
    return await axios.get(`${URL}/user_detail/${username}`,{params:{token:token}}).then((res)=>{
   if(res.status===200)
   {
    window.location.assign(`http://localhost:3000/user_detail/${username}`);
   }
    });
}
catch(error)
{
    if(error.response.status===401 || error.response.status===404)
    {
        
        localStorage.removeItem('token');
        window.location.assign('http://localhost:3000/login');
    }
}
}
const getTokenImageServer=async(payload,token,username)=>
{
  try
  { var res=await axios.post(`${URL}/user_detail/${username}?token=${token}`,payload);
    
    var list_value=[];
    list_value.push(res.data.token);
    list_value.push(res.data.expire);
    list_value.push(res.data.signature);
    return list_value;
  }
  catch(err)
  {
    throw err;
  }
}

const uploadImageToServer=async(data)=>
{
 try
 {  var list=[];
    var res=await axios.post('https://upload.imagekit.io/api/v1/files/upload',data,{headers:{"Content-Type":"multipart/form-data"}});
    var url='';
    var status=0;
    if(res.status===200)
    {
        url=res.data.url;
        status=200;        
    }
    list.push(url);
    list.push(status);
    return list;
 }
 catch(err)
 {
    AlertErrorDialog(err.toString(),"Có lỗi khi upload avatar");
 }
}

const getWaitingRoom=async(token,room_name)=>
{
try
{
  return await axios.get(`${URL}/waiting_room/${room_name}`,{params:{'token':token}}).then((res)=>
  {
   if(res.status===200)
   {
     var room_name=res.data.room_name;
     localStorage.setItem('room_name',room_name);
     window.location.assign(`http://localhost:3000/waiting_room/${room_name}`);
   }
  });
}
catch(err)
{
    if(err.response.status===401)
    {
        localStorage.removeItem('token');
        window.location.assign('http://localhost:3000/login');
    }
}

}
const authToken=async(token)=>
{
try{
await axios.post(`${URL}/auth?token=${token}`,{});
return true;
}
catch(err)
{
if(err.response.status===401)
{   
    window.location.assign('http://localhost:3000/login');
    return false;
}
}
}

const getStatistics=async(token,userName)=>
{
 try
 {
   return await axios.get(`${URL}/statistics/${userName}`,{params:{'token':token}}).then((res)=>{
        if(res.status===200)
        {   localStorage.setItem('easy_win',res.data.easy_win.toString());;
            localStorage.setItem('easy_lose',res.data.easy_lose.toString());
            localStorage.setItem('medium_win',res.data.medium_win.toString());
            localStorage.setItem('medium_lose',res.data.medium_lose.toString());
            localStorage.setItem('hard_win',res.data.hard_win.toString());
            localStorage.setItem('hard_lose',res.data.hard_lose.toString());
            localStorage.setItem('extreme_win',res.data.extreme_win.toString());
            localStorage.setItem('extreme_lose',res.data.extreme_lose.toString());            
            window.location.assign(`http://localhost:3000/statistics/${userName}`);

        }
    });
 }
 catch(err)
 {
    if(err.response.status===401 || err.response.status===404)
    {
     localStorage.removeItem('token');
     window.location.assign('http://localhost:3000/login');
    }
 }
}

const getMatch=async(token,roomName)=>
{
    try{
     return axios.get(`${URL}/match/${roomName}`,{params:{token:token}}).then((res)=>{
        if(res.status===200)
        {   
            window.location.assign(`http://localhost:3000/match/${res.data.room_name}`);
        }
     })
    }
    catch(err)
    {
        if(err.response.status===401)
        {
            window.location.assign('http://localhost:3000/login');
            return false;
        }
    }
}

export {addUser,getUserRegisterRes,loginUser,list,joiningRoom,userInfo,userDetail,getUserDetail,getTokenImageServer,uploadImageToServer,joiningHall,joiningLevelPicker,getWaitingRoom,authToken,getStatistics,getMatch};