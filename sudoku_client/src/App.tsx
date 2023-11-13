import React, { useEffect, useState } from 'react';
import {io} from "socket.io-client";
import styled from "styled-components"
import './App.css';
import socketService from "./services/socketService";
import JoinRoom from './components/JoinRoom';
import gameContext, { IgamecontextProps } from './gameContext';
import ChangeButton from './components/changeButton';
import SudokuBoard from './components/sudokuBoard';
import { ISudokuBoard } from './components/sudokuBoard/index';
import Login from './components/login/index';
import Register from './components/register/index';
import { BrowserRouter,Navigate,useNavigate} from 'react-router-dom';
import { Routes,Route } from 'react-router';
import { PageNotFound, TokenExpired } from './components/error_page';
import UserProfile from './components/user_profile';
import UserDetail from './components/user_detail';
import WaitingRoomUser from './components/user_waiting_info';
import WaitingRoom from './components/waitingRoom';
import { authToken } from './services/apiService/api';
import ProtectedRoutes from './components/protected_route';
import Statistic from './components/statistics';
import Statistics from './components/statistics';
import Hall from './components/Hall';
import LevelPick from './components/LevelPick';
import SingleBoard from './components/SingleBoard';

function App() {
  const App=styled.div`
  width:100%;
  height:100%;
  display:flex;
  flex-direction:column;
  align-items:center;
  padding:1em;
  margin-top:50px;
  `;
  const MainContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;
  const connectSocket=async()=>{
    const socket=await socketService.connect("http://localhost:9000").catch((err)=>{console.log(err);});
    
  };
  const [isInRoom,setIsInRoom]=useState(false);
  const [isGameStarted,setIsGameStarted]=useState(false);
  const [roomName,setRoomName]=useState('');
  const [countMem,setCountMem]=useState(0);
  const [new_board,setNewBoard]=useState([]);
  const [timeValue,setTimeValue]=useState(false);
  const [timer,setTimer]=useState("");
  const [stopGame,setStopGame]=useState(false);
  const [boardSolved,setBoardSolved]=useState([]);
  const [userName,setUserName]=useState('');
  const [email,setEmail]=useState('');
  const [levelGame,setLevelGame]=useState('');
  const [token,setToken]=useState(false);
  var userInfo={
    username:'',
    email:'',
    gender:'',
    avatar:'',
    created_date:''
  }

  const [loginUser,setLoginUser]=useState(userInfo);
  useEffect(()=>
  {
    connectSocket();
  }
  ,[]);

 
  const gameContextValue:IgamecontextProps=
  {isInRoom,
   setIsInRoom,
   isGameStarted,
   setIsGameStarted,
   roomName,
   setRoomName,
   countMem,
   setCountMem,
   new_board,
   setNewBoard,
   timeValue,
   setTimeValue,
   timer,
   setTimer,
   stopGame,
   setStopGame,
   boardSolved,
   setBoardSolved,
   userName,
   setUserName,
   email,
   setEmail,
   levelGame,
   setLevelGame,
   loginUser,
   setLoginUser,
  }
  return (
    <BrowserRouter>
    <gameContext.Provider value={gameContextValue}>
    <App>
     <MainContainer>
    <Routes>
    <Route path='/login' element={<Login/>}/>
    <Route path='/register' element={<Register/>}/>
    <Route path='*' element={<PageNotFound/>}></Route>
    <Route element={<ProtectedRoutes/>}>
      <Route path='/user_profile/:username' element={<UserProfile user={JSON.parse(localStorage.getItem('current_user'))}/>}></Route>
      <Route path='/' element={<Login/>}/>
      <Route path='/expired_token' element={<TokenExpired/>}/>
      <Route path='/404' element={<PageNotFound/>}/>
      <Route path='/user_detail/:username' element={<UserDetail user={JSON.parse(localStorage.getItem('current_user'))}/>}></Route>
      <Route path='/user_border/'element={<WaitingRoomUser user={JSON.parse(localStorage.getItem('current_user'))}/>}/>
      <Route path='/waiting_room/:room_name' element={!isInRoom?<WaitingRoom/>:<SudokuBoard firstPlayer={JSON.parse(localStorage.getItem('first_player'))} secondPlayer={JSON.parse(localStorage.getItem('second_player'))}/>}></Route>
      <Route path='/join' element={<JoinRoom/>}/>
      <Route path='/statistics/:username' element={<Statistics user={JSON.parse(localStorage.getItem('current_user'))}/>}/>
      <Route path='/hall' element={<Hall/>}></Route>
      <Route path='/level' element={!isInRoom?<LevelPick/>:<SingleBoard level={levelGame}/>}></Route>
      </Route>
    </Routes>
   </MainContainer>
   </App>
   </gameContext.Provider>
  </BrowserRouter>
  );
}
export default App;
