import React from "react";
import { ISudokuBoard } from './components/sudokuBoard/index';
export interface IgamecontextProps
{
isInRoom:boolean;
setIsInRoom:(isInRoom:boolean)=>void;
levelGame:string;
setLevelGame:(levelGame:string)=>void;
isGameStarted:boolean;
setIsGameStarted:(isGameStarted:boolean)=>void;
roomName:string;
setRoomName:(roomName:string)=>void;
countMem:number;
setCountMem:(countMem:number)=>void;
new_board:any[];
setNewBoard:(new_board:any[])=>void;
timeValue:boolean;
setTimeValue:(timeValue:boolean)=>void;
timer:string;
setTimer:(timer:string)=>void;
stopGame:boolean;
setStopGame:(stopGame:boolean)=>void;
boardSolved:any[];
setBoardSolved:(boardSolved:any[])=>void;
userName:string;
setUserName:(userName:string)=>void;
email:string;
setEmail:(email:string)=>void;
loginUser:any;
setLoginUser:(loginUser:any)=>void;

}
const defaultState:IgamecontextProps=
{
isInRoom:false,
setIsInRoom:()=>{},
isGameStarted:false,
setIsGameStarted:()=>{},
roomName:'',
setRoomName:()=>{},
countMem:0,
setCountMem:()=>{},
new_board:[],
setNewBoard:()=>{},
timeValue:false,
setTimeValue:()=>{},
timer:"",
setTimer:()=>{},
stopGame:false,
setStopGame:()=>{},
boardSolved:[],
setBoardSolved:()=>{},
userName:'',
setUserName:()=>{},
email:'',
setEmail:()=>{},
levelGame:'',
setLevelGame:()=>{},
loginUser:{
    username:'',
    email:'',
    gender:'',
    avatar:'',
    created_date:''
},
setLoginUser:()=>{}
}
export default React.createContext(defaultState);