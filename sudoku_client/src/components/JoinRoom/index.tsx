import React, { useContext, useState } from "react";
import styled from "styled-components";
import socketService from "../../services/socketService";
import gameServices from "../../services/gameServices";
import gameContext from "../../gameContext";
import { SudokuPuzzle } from "../../sudokuPuzzle";
import {useEffect} from 'react';
import { authToken, getWaitingRoom, joiningHall, joiningRoom } from "../../services/apiService/api";
import { Navigate, useNavigate } from 'react-router-dom';
import { useLocation } from "react-router-dom";
import { useSearchParams } from "react-router-dom";
import DropDownView from "../dropdown_menu";
import { AlertWarningDialog } from "../dialogbox";
import { type } from '@testing-library/user-event/dist/type';
const JoinRoomContainer=styled.div`
width:100%;
height:100%;
display:flex;
flex-direction:column;
align-items:center;
justify-content:center;
margin-top:10em`
;
const RoomIdInput=styled.input`
height:30px;
width:20em;
font-size:18px;
outline:none;
border:1px solid #8e44ad;
border-radius:3px;
padding:0 10px;
`;
const JoinButton=styled.button`
outline:none;
background:#8e44ad;
color:#ffffff;
font-size:18px;
border:2px solid transparent
border-radius:3px;
padding:4px 18px;
transition:all 230ms ease-in-out;
margin-top:1em;
cursor:pointer;
&:hover{
    background-color:transparent;
    border:2px solid #8e44ad;
    color:#8e44ad;
}
`;
const UserInfo=styled.div`

position:absolute;
top:70px;
right:50px;
`;
const UserName=styled.div`
width:auto;
height:auto;
font-size:15px;
font-color:black;
float:center;
color:green;
text-align:center;
`
const Email=styled.div`
width:auto;
height:auto;
font-size:15px;
color:green;
text-align:center;
`
function JoinRoom()
{  
    const {roomName,setRoomName}=useContext(gameContext);
    const [joining,setJoining]=useState(false);
    const {isInRoom,setIsInRoom}=useContext(gameContext);
    const {countMem,setCountMem}=useContext(gameContext);
    const {new_board,setNewBoard}=useContext(gameContext);
    const {userName,setUserName}=useContext(gameContext);
    const {email,setEmail}=useContext(gameContext);
    const navigate=useNavigate();
    const handleRoomNameChange=(e:React.ChangeEvent<any>)=>{
        e.preventDefault();
        const value=e.target.value;
        setRoomName(value.trim());
    };
    var prevPage=async()=>
    {
       var token=localStorage.getItem('token');
       var token_ob=
       {
        'token':token
       };
         await joiningHall(token_ob);
    }
    var sudokuPuzzle=()=>
  {
    var ar=new SudokuPuzzle(9,80);
    ar.fillValues();
    var ar1=ar.returnArray();
    return ar1;
  }
  useEffect(()=>{
    var token=localStorage.getItem('token');
    if(token)
    {
        authToken(token).then((res)=>
        {
        if(!res)
        {
            localStorage.removeItem('token');
            window.location.assign('http://localhost:3000/login');
        }
        });
    }
  },[]);
const joinRoom=async(e)=>{
    e.preventDefault();
    const socket=socketService.socket;
       if(!socket)
       {
           return;
       }
       if(!roomName || roomName==='')
       {
        AlertWarningDialog("Không được để trống tên phòng","Nhập tên phòng");
        return;
       }
     setJoining(true);
     //var t=sudokuPuzzle();
     //setNewBoard(t);
     const joined=await gameServices.joinGameRoom(socket,roomName).catch((error)=>{alert(error);});
     setJoining(false);
     var token=localStorage.getItem('token');
     await getWaitingRoom(token,roomName);
    };
return(
    <form onSubmit={joinRoom}>
        <h1 style={{color:"	#00b8ff", fontWeight:"bold"}}>Welcome to Our Sudoku game</h1>
        <UserInfo>
            <DropDownView></DropDownView>
        </UserInfo>
        <JoinRoomContainer>
            <h3 style={{color:'#f96363'}}><strong>Enter the room id to join your sudoku game</strong></h3>
            <RoomIdInput autoFocus placeholder="Join Id" value={roomName} onChange={handleRoomNameChange}/>
            <JoinButton type="submit" disabled={joining}>
                {joining?"Is joining...":"Join"}
                </JoinButton>
                <button type='button' className="text-light" style={{'marginTop':'100px'}} onClick={prevPage}>Quay lại</button>
        </JoinRoomContainer>
    </form>
    
);
}
export default JoinRoom;
