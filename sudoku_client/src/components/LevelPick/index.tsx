import React, { useContext, useState } from "react";
import styled from "styled-components";
import DropDownView from "../dropdown_menu";
import { joiningHall, joiningRoom } from "../../services/apiService/api";
import gameContext from "../../gameContext";
function LevelPick()
{
const UserInfo=styled.div`
position:absolute;
top:70px;
right:50px;
`;
const{isInRoom,setIsInRoom}=useContext(gameContext);
const{levelGame,setLevelGame}=useContext(gameContext);
var token=localStorage.getItem('token');
const prevPage=async()=>
{
    var token_ob={
        'token':token
    };
    await joiningHall(token_ob);
}

const handleClickLevel=async(level)=>
{
setIsInRoom(true);
setLevelGame(level);
}

  return(
   <div>
    <UserInfo>
        <DropDownView></DropDownView>
    </UserInfo>
     <div className="level-option-container">
    <h2 style={{'color':'white','fontWeight':'bold','marginLeft':'30px'}} >Chọn cấp độ</h2>
    <button className="level-button-padding text-light" onClick={()=>handleClickLevel('Easy')}>Easy</button>
    <button className="level-button-padding text-light"onClick={()=>handleClickLevel('Medium')}>Medium</button>
    <button className="level-button-padding text-light"onClick={()=>handleClickLevel('Hard')}>Hard</button>
    <button className="level-button-padding text-light"onClick={()=>handleClickLevel('Extreme')}>Extreme</button>
    <button className="text-light" style={{'marginTop':'50px','width':'80px','height':'50px','marginLeft':'75px'}} onClick={prevPage}>Quay lại</button>
     </div>
   </div>
  );
}
export default LevelPick;