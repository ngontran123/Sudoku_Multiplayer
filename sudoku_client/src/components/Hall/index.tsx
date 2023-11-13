import React from "react";
import { joiningLevelPicker, joiningRoom } from "../../services/apiService/api";
import styled from "styled-components";
import DropDownView from "../dropdown_menu";
function Hall()
{   var token=localStorage.getItem('token');
const UserInfo=styled.div`

position:absolute;
top:70px;
right:50px;
`;    var token_ob={
    'token':token
};
     var current_user=localStorage.getItem('current_user');
     var multiplayer_pick=async()=>{
        
       await joiningRoom(token_ob);
    }
    var singleplayer_pick=async()=>{
        await joiningLevelPicker(token_ob);
    }
    return(
       <div className="container">
        <UserInfo>
            <DropDownView></DropDownView>
            </UserInfo>
        <div className="option-container">
        <h2 style={{'color':"white",'fontWeight':'bold'}}>Choose Your Options:</h2>
        <button className="text-light button-padding" onClick={singleplayer_pick}> 
            Single Games
        </button>
        <button className="text-light button-padding" onClick={multiplayer_pick}>
            Multiplayer Game
        </button>
        </div>
        </div>
    );
}
export default Hall;