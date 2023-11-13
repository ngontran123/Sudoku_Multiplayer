import React from "react";
import styled from "styled-components";
import '../login/style.css';
import { type } from '@testing-library/user-event/dist/type';
import {useState} from 'react';
import Checkbox from '@material-ui/core/Checkbox';
import { FormControlLabel } from "@material-ui/core";
import { addUser } from "../../services/apiService/api";
import {useEffect} from 'react';
import { AlertWarningDialog } from "../dialogbox";
function Register()
{  const defaultValue={
    username:'',
    password:'',
    gender:'',
    email:''
};
const [checkBoxList,setCheckBoxList]=useState(['Male','Female','Others']);
const [confirmPassword,setConfirmPassword]=useState('');
const [isChecked,setIsChecked]=useState();
const [user,setIsUser]=useState(defaultValue);
const [checkUser,setCheckUser]=useState(defaultValue);
const loginUrl="http://localhost:3000/login";
var onChange=(e)=>{
    if(e.target.checked)
    {
        if(!isChecked)
        {
            setIsChecked(e.target.value);
        }
        else{
            setIsChecked(null);
            setIsChecked((state)=>{return e.target.value});
        }
        onChangeForm(e);
    }
}

var onChangeForm=(e)=>{
    if(e.target.name==='password_confirm')
    {   console.log(e.target.value);
        setConfirmPassword(e.target.value);
    }
    else
    { 
    setIsUser({...user,[e.target.name]:e.target.value});
    setCheckUser(prevState=>({...prevState,[e.target.name]:''}));
    }
}
const isValidEmail=(email)=>
{
 const re=/^[^\s@]+@[^\s@]+\.[^\s@]+$/;
 return re.test(email);   
}

const checkValidPassword=(password)=>{
    const re=/(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])(?=.{8,})/
    return re.test(password);
}
const checkIsFilled=(user)=>{
    var empty_txtbox=[];
    let user_ob={
    username:'',
    password:'',
    gender:'',
    email:''
    }
    if(user.username==="")
    {
        empty_txtbox.push('username_check');
        user_ob.username="Không được để trống tên đăng nhập";
    }
    if(user.password==="")
    {
        empty_txtbox.push('password_check');
        user_ob.password="Không được để trống mật khẩu";
    }
    if(user.gender==="")
    {
        empty_txtbox.push("gender_check")
        user_ob.gender="Không được bỏ qua thông tin này.";
    }
    if(user.email==="")
    {
        empty_txtbox.push("email_check");
        user_ob.email="Không được bỏ trống email.";
    }
    Object.keys(user_ob).map((key,index)=>{
       setCheckUser(prevState=>({...prevState,
         [key]:user_ob[key]
       }));
    });
    return empty_txtbox;
}
var addUserFunc=async ()=>
{   var empty_txtbox=checkIsFilled(user);
    if(empty_txtbox.length>0)
    {
        return;
    }
    if(!checkValidPassword(user.password))
    {
        AlertWarningDialog("Mật khẩu chưa đủ mạnh","Thông tin chưa an toàn");
        return;
    }
    if(confirmPassword!==user.password)
    {
        AlertWarningDialog("Mật khẩu không trùng khớp","Không xác thực");
        return;
    }
    else if(!isValidEmail(user.email))
    {
        AlertWarningDialog("Email không hợp lệ","Không xác thực");
        return;
    } 
    else
    {
      await addUser(user);
    }
}
const render=()=>{
return checkBoxList.map((box)=>{
    return(
    <FormControlLabel
    control={<Checkbox checked={isChecked?isChecked===box:false} name='gender' value={box} onChange={onChange}/>} label={box}
    />
)})
}
return(
<div className="container">
  <div className="float">
    <div className="stack-g">
      <div className="inline" id="login">
      <div className="title">
            <h2>Register</h2>
        </div>
        <div className="center_register">
        <input type="text" id="username" name='username' placeholder="Username" onChange={onChangeForm}></input>
        <p className="username_check" style={{color:'red'}}>{checkUser.username}</p>
        <input type="password" id="password" name='password' placeholder="Password" onChange={onChangeForm}></input>
        <p className="password_check" style={{color:'red'}}>{checkUser.password}</p>
        <input type="password" id="password" name='password_confirm' placeholder="Confirm Password" onChange={onChangeForm}></input>
        <span className="regisbox">
            {render()}
        </span>
        <p className="gender_check" style={{color:'red'}}>{checkUser.gender}</p>
        <input type="email" id="email" placeholder="Email" name='email' onChange={onChangeForm}></input>
        <p className="email_check" style={{color:'red'}}>{checkUser.email}</p>
        <button type="button" id="register" className="center_register_button" onClick={()=>addUserFunc()}>Register</button>
        </div>
        <p>
            <strong>Đã có tài khoản?Nhấn <a href={loginUrl} style={{color:'red'}}>Đăng nhập</a> để đăng nhập tài khoản.
        </strong>
        </p>
        </div>
        </div>
        </div>
        </div>
        );
}
export default Register;