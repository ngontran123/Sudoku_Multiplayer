import React from "react";
import styled from "styled-components";
import { loginUser,list, getUserRegisterRes, joiningRoom} from "../../services/apiService/api";
import './style.css';
import { useState, useContext } from 'react';
import { useNavigate,useSearchParams } from "react-router-dom";
import gameContext from "../../gameContext";
import { stat } from 'fs';
import {useEffect} from 'react';
import Form from "antd/es/form/Form";
function Login()
{
  const defaultValue={
    username:'',
    password:''
  };
 const navigate=useNavigate();
 const [user,setUser]=useState(defaultValue);
 const [checkUser,setCheckuser]=useState(defaultValue);
 const [isValid,setIsValid]=useState(false);
 const userLogin=async(e)=>{
  e.preventDefault();
  var empty_txt=checkTxtIsFilled(user);  
  if(empty_txt.length>0)
  {
    return;
  }
 await loginUser(user);
 };
 const onChange=(e)=>{
  setUser({...user,[e.target.name]:e.target.value});
  setCheckuser(prevState=>({...prevState,[e.target.name]:''}));
 }
 const navigateClick=()=>{
  navigate('/register');
 }
 const checkTxtIsFilled=(user)=>{
  var user_checked={
    username:'',
    password:''
  };
  var empty_txt=[];
  if(user.username==='')
  {
   empty_txt.push('username');
   user_checked.username='Không được để trống tên username.';
  }
  if(user.password==='')
  {
    empty_txt.push('password');
    user_checked.password='Không được để trống mật khẩu.';
  }
  Object.keys(user_checked).map((key,idx)=>{
    setCheckuser(prevState=>({...prevState,[key]:user_checked[key]}));
  });
  return empty_txt;
 }
 useEffect(()=>{
  getUserRegisterRes(isValid);
  if(!isValid)
  {
    setIsValid(true);
  }
  if(localStorage.getItem('token')!=='' && localStorage.getItem('token')!=null)
  {
    var token_ob=
    {
      token:localStorage.getItem('token')
    };
   }
},[]);
return(
<div className="container">
  <div className="float">
    <div className="stack-g">
      <div className="inline" id="login">
    <div className="title">
        <h2>Login</h2>
    </div>
    <form onSubmit={userLogin}> 
        <input type="text" autoFocus id="username" name="username" placeholder="Username" onChange={onChange}></input>
        <p style={{"color":"red"}}>{checkUser.username}</p>
        <input type="password" autoFocus id="password" name="password" placeholder="Password" onChange={onChange}></input>
        <p style={{"color":"red"}}>{checkUser.password}</p>
        <div className="optional">
        <button type="submit" id="login" onClick={userLogin}>Login</button>
        <button type="button" id="register" onClick={navigateClick}>Register</button>
        </div>
        </form>
        </div>
        </div>
        </div>
        </div>
        )
}
export default Login;
