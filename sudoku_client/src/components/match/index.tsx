import gameServices from "../../services/gameServices";
import socketService from "../../services/socketService";
import SudokuBoard from "../sudokuBoard";
import {useState,useEffect} from 'react';
function SudokuMatch()
{ 
    const defaultPlayer=
    {
     display_name:'',
     gender:'',
     motto:'',
     avatar:'https://ik.imagekit.io/qlzt6djaz/user.png'
    };
   const[secondPlayer,setSecondPlayer]=useState(defaultPlayer);
   useEffect(() => {
        var current_user=localStorage.getItem('current_user');
        gameServices.roomUser(socketService.socket,current_user).then((res)=>{
            setSecondPlayer(JSON.parse(res));
        });   
   },[]);
   return(
   <SudokuBoard firstPlayer={JSON.parse(localStorage.getItem('current_user'))} secondPlayer={secondPlayer}/>
   );
}
export default SudokuMatch;