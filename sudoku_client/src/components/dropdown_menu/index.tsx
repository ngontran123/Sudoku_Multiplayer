import React from "react";
import ReactDOM from "react-dom";
import { HLDropdown, HLMenu, HLCard } from "synos-helena";
import { Avatar } from "antd";
import "synos-helena/lib/helena.css";
import { userInfo,getStatistics} from "../../services/apiService/api";
import styled from "styled-components";
import socketService from "../../services/socketService";
import gameServices from "../../services/gameServices";
const DropDownView=()=>{
  var token=localStorage.getItem('token');
  var current_user=JSON.parse(localStorage.getItem('current_user'));
  var current_user_avatar=current_user.avatar; 
  var current_username=current_user.username;

   const signOut=()=>{
   localStorage.removeItem("token");
   localStorage.removeItem("current_user");
    window.location.assign('http://localhost:3000/login');
   }  
  
   const getUserInfo=async(e)=>
   { 
    e.preventDefault();
    await userInfo(token,current_username);  
   }  

   const getStatisticInfo=async(e)=>
   { e.preventDefault();
    await getStatistics(token,current_username);
   };
    
   const menu = (
      <HLMenu>
        <HLMenu.Item>
          
       <a target="_self" onClick={getUserInfo}>
        Thông tin tài khoản
        </a>
        </HLMenu.Item>
        
        <HLMenu.Item>
          <a target="_self" onClick={getStatisticInfo}>
            Thống kê
          </a>
        </HLMenu.Item>
        
        <HLMenu.Item>
          <a
            target="_self"
            rel="noopener noreferrer"
            onClick={signOut}
          >
            Đăng xuất 
          </a>
        </HLMenu.Item>
      </HLMenu>
    );
    return (
        <HLDropdown overlay={menu} trigger={["click"]}>
          <Avatar src={current_user_avatar}/>
        </HLDropdown>
    );
}
export default DropDownView;

