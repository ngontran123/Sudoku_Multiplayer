import React, { useContext, useEffect } from "react";
import styled from "styled-components";
import ChangeButton from "../changeButton";
import { useState } from "react";
import './index.css';
import Button from "../buttons";
import { SudokuPuzzle } from "../../sudokuPuzzle";
import '../../App.css';
import gameContext from "../../gameContext";
import gameServices from "../../services/gameServices";
import { type } from "@testing-library/user-event/dist/type";
import socketService from "../../services/socketService";
import Timer from '../timer/index';
import cloneDeep from 'lodash.clonedeep';
import { getWaitingRoom, joiningRoom } from "../../services/apiService/api";
import { AlertCheckDialog, AlertErrorDialog, AlertWarningDialog } from "../dialogbox";
var BoardContainer=styled.div`
width:100%;
height:90%;
display:flex;
flex-direction:column;
align-items:center;
justify-content:center;
position:absolute;
top:7%;
`;
const Square=styled.div
`width:50px;
 height:50px;
border:1px solid black;
background-color:#ffffff;
cursor:pointer;
font-size:25px;
text-align:center; 
&:hover
{
width:50px;
height:50px;
border:1px solid black;
background-color:#7f7f7f ;
cursor:pointer;
font-size:25px;
text-align:center; 
}
`;
const Table=styled.table`
border-collapse:collapse;
border:3px solid #8e324d;
background-color:#8e324d;
`;
const Td=styled.td`
padding:0px;
`;
const puzzleColor=styled.div`
background-color:cadetblue;
`
const SquareBottom=styled.div`
width:50px;
 height:50px;
border:1px solid black;
border-bottom:3px solid black;
background-color:#ffffff;
cursor:pointer;
font-size:25px;
text-align:center;
&:hover
{
  width:50px;
 height:50px;
border:1px solid black;
border-bottom:3px solid black;
background-color:#7f7f7f;
cursor:pointer;
font-size:25px;
text-align:center;
}
`
const SquareRight=styled.div`
width:50px;
 height:50px;
border:1px solid black;
border-right:3px solid black;
background-color:#ffffff;
cursor:pointer;
font-size:25px;
text-align:center;
&:hover
{
 width:50px;
 height:50px;
border:1px solid black;
border-right:3px solid black;
background-color:#7f7f7f;
cursor:pointer;
font-size:25px;
text-align:center;
}
`
const SquareBottomRight=styled.div`
width:50px;
 height:50px;
border:1px solid black;
border-bottom:3px solid black;
background-color:#ffffff;
border-right:3px solid black;
cursor:pointer;
font-size:25px;
text-align:center;
&:hover
{
  width:50px;
 height:50px;
border:1px solid black;
border-bottom:3px solid black;
background-color:#7f7f7f;
border-right:3px solid black;
cursor:pointer;
font-size:25px;
text-align:center;
}
`
const SquareBottomColor=styled.div`
width:50px;
 height:50px;
border:1px solid black;
border-bottom:3px solid black;
background-color:#ffffff;
cursor:pointer;
font-size:25px;
text-align:center;
background-color:cadetblue;
&:hover
{
  width:50px;
 height:50px;
border:1px solid black;
border-bottom:3px solid black;
background-color:#ffffff;
cursor:pointer;
font-size:25px;
text-align:center;
background-color:#4c7e80;
}
`
const SquareRightColor=styled.div`
width:50px;
 height:50px;
border:1px solid black;
border-right:3px solid black;
background-color:#ffffff;
cursor:pointer;
font-size:25px;
text-align:center;
background-color:cadetblue;
&:hover
{
  width:50px;
 height:50px;
border:1px solid black;
border-right:3px solid black;
background-color:#ffffff;
cursor:pointer;
font-size:25px;
text-align:center;
background-color:#4c7e80;
}
`
const SquareBottomRightColor=styled.div`
width:50px;
 height:50px;
border:1px solid black;
border-bottom:3px solid black;
background-color:#ffffff;
border-right:3px solid black;
cursor:pointer;
font-size:25px;
text-align:center;
background-color:cadetblue;
&:hover
{
  width:50px;
 height:50px;
border:1px solid black;
border-bottom:3px solid black;
background-color:#ffffff;
border-right:3px solid black;
cursor:pointer;
font-size:25px;
text-align:center;
background-color:#4c7e80;
}
`
const SquareColor=styled.div`
width:50px;
 height:50px;
border:1px solid black;
background-color:#ffffff;
cursor:pointer;
font-size:25px;
text-align:center;
background-color:cadetblue;
&:hover
{
  width:50px;
 height:50px;
border:1px solid black;
background-color:#ffffff;
cursor:pointer;
font-size:25px;
text-align:center;
background-color:#4c7e80;
}
`
const PlayStopper = styled.div`
  width: 100%;
  height: 100%;
  position: fixed;
  bottom:0;
  left:0;
  top:0;
  z-index: 99;
  cursor: default;
`;
const NoteBox=styled.div`
box-sizing:content-box;
width:5px;
height:5px;
padding:5px;
font-size:10px;
color:#000000;
text-align:center;
display:inline-block;
float:left;
`

const User=styled.div`
width:auto;
height:auto;
border:2px solid black;
`
const UserContainer=styled.div`
display:flex;
flex-wrap:wrap;
gap:400px;
padding:10px;
`
export type ISudokuBoard=Array<Array<string|null>>;
function SudokuBoard({firstPlayer,secondPlayer})
{
  const [value,setValue]=useState(0);
 const [board,setBoard]=useState<ISudokuBoard>([]);
 const[isClickable,setIsClickable]=useState([])
 const [row,setRow]=useState(-1);
 const [column,setColumn]=useState(-1);
 const [sdkPuzzle,setSdkPuzzle]=useState([]);
  const[isCliked,setIsClick]=useState(false);
  const[game1,setGame1]=useState([]);
  const[sol1,setSol1]=useState([]);
  const[puzzleButton,setPuzzleButton]=useState([]);
  const [timeval,setTimeVal]=useState(new Date());
  const {timeValue,setTimeValue}=useContext(gameContext);
  const {isGameStarted,setIsGameStarted}=useContext(gameContext);
  const {roomName,setRoomName}=useContext(gameContext);
  const {countMem,setCountMem}=useContext(gameContext);
  const {new_board,setNewBoard}=useContext(gameContext);
  const {timer,setTimer}=useContext(gameContext);
  const [text,setText]=useState("");
  const {stopGame,setStopGame}=useContext(gameContext);
  const {boardSolved,setBoardSolved}=useContext(gameContext);
  const [isNote,setIsNote]=useState(false);
  const [arrayNote,setArrayNote]=useState([...Array(9)].map(x=>[...Array(9)].map(x=>[...Array(9)].map(x=>x))));
  const [numGame,setNumGame]=useState(1);
  const [gameStarted,setGameStarted]=useState(false);
  const [firstPlayerScore,setFirstPlayerScore]=useState(0);
  const [secondPlayerScore,setSecondPlayerScore]=useState(0);
  const [coordinateHint,setCoordinateHint]=useState([]);
  const [hintClick,sethintClick]=useState(3);
  const delay=ms=>new Promise(rs=>setTimeout(rs,ms));
  var arr1=[];
  var arr2=[];
  
  var backToDefault=()=>
  {
    var t=game1;
    var t1=arrayCopy(board);
    var t2=isClickable;
    for(let i=0;i<9;i++)
    {
        for(let j=0;j<9;j++)
        {  var is_deletable=checkValidCoordinate(i,j,coordinateHint);
          if(!is_deletable)
          {
            if(t[i][j]!==t1[i][j])
            {
                t1[i][j]="";
                t2[i][j]=true;
            }
          }
        }
    }
    setIsClickable(t2);
    setBoard(t1);
  }
  var splitArray=(arr,part)=>{
    var tmp=[];
    for(let i=0;i<arr.length;i+=part)
    {
      tmp.push(arr.slice(i,i+part));
    }
    return tmp;
  }
  var emptyNote=()=>{
    var temp_note=[...arrayNote];
    for(let i=0;i<9;i++)
    {
      for(let j=0;j<9;j++)
      {
        temp_note[i][j].splice(0,temp_note[i][j].length);
      }
    }
    setArrayNote(temp_note);
  }
  var defaultBoard=()=>
  {  
    if((countMem===1)||stopGame)
    { 
      var ar=new Array(9);
      var ar1=new Array(9);
      var ar2=new Array(9);
      var ar3=new Array(9);
      for(let i=0;i<9;i++)
      {
          ar[i]=new Array(9);
          ar1[i]=new Array(9);
          ar2[i]=new Array(9);
          ar3[i]=new Array(9);
      }
      for(let i=0;i<9;i++)
      {
          for(let j=0;j<9;j++)
          { 
            if(arr1[i][j]!==0&&arr1[i][j]!==''&&arr1[i][j]!=='0')
            {
              ar[i][j]=arr1[i][j];
              ar1[i][j]=false;
              ar3[i][j]=true;
            }
            else{
                ar[i][j]='';
                ar1[i][j]=true;
            }
          }
        }
       setBoard(ar);
       setBoard((state)=>{
        updateGame(state);
         return state;
       });
       emptyNote();
       setSdkPuzzle(ar2);
       setIsClickable(ar1);
       setPuzzleButton(ar3);
      }
      else{
        updateGame(board);
      }
  };
  var defaultBoardVer1=(arr1,solve_board)=>
  {
    var ar=new Array(9);
      var ar1=new Array(9);
      var ar2=new Array(9);
      var ar3=new Array(9);
      for(let i=0;i<9;i++)
      {
          ar[i]=new Array(9);
          ar1[i]=new Array(9);
          ar2[i]=new Array(9);
          ar3[i]=new Array(9);
      }
      for(let i=0;i<9;i++)
      {
          for(let j=0;j<9;j++)
          { 
            if(arr1[i][j]!=='')
            {
              ar[i][j]=arr1[i][j];
              ar1[i][j]=false;
              ar3[i][j]=true;
            }
            else{
                ar[i][j]=''
                ar1[i][j]=true;
            }
          }
        }
       setBoard(ar);
       emptyNote();
       setGame1(arr1);
       setSdkPuzzle(ar2);
       setIsClickable(ar1);
       setPuzzleButton(ar3);
       setSol1(solve_board);
  };



  var sudokuPuzzleGenerate=()=>
  {
  if(!stopGame)
  {
  if(countMem===1)
  {
   const t1=JSON.parse(JSON.stringify(new_board));
   let t2=JSON.parse(JSON.stringify(new_board));
   arr1=t1;
   var t=t2.join("").toString();
   t=t.replace(/[',']/gi,"");
   arr2=Array.from(t);
   setSol1(arr2);
   removeKDigits(arr1);
  }
}
else{
  var array=splitArray(boardSolved,9);
  const t1=JSON.parse(JSON.stringify(array));
  arr1=t1;
}
  }
  const updateGame=(state)=>{
    const new_board=[...state];
    const solve_board=[...arr2];
     if(socketService.socket)
     {
      gameServices.updateGame(socketService.socket,new_board,solve_board,roomName);
     }
  }
  const handleUpdate=()=>{
    if(!stopGame)
    {
    if(socketService.socket)
    {
    gameServices.onUpdateGame(socketService.socket,(new_board,solved)=>{
    defaultBoardVer1(new_board,solved);
    });
  }
}
  }
  const updateTimer=()=>
  { 
    if(socketService.socket)
    { 
      gameServices.timerGame(socketService.socket,roomName,text);

    }
  };
  const checkLength=(ar)=>
  {
    var l=0;
    for(let i=0;i<9;i++)
    {
        for(let j=0;j<9;j++)
        {
            if(ar[i][j]!=="")
            {
                l++;
            }
        }
    }
    return l;
  }
  const checkWiner=(board)=>{
    var b=board;
    var l=checkLength(b);
    let c1=0;
    var s=sol1;
    if(l===81)
    {
   for(let i=0;i<9;i++)
   {
    for(let j=0;j<9;j++)
    {
    if(b[i][j]===s[i][j])
    {
      c1++;
    }
  }
   }
      if(c1===81)
      {
        var current_user=localStorage.getItem('current_user');
        gameServices.updateTimer(socketService.socket,false,numGame);
        gameServices.updateScore(socketService.socket,current_user,numGame.toString(),firstPlayer.display_name,secondPlayer.display_name);
        AlertCheckDialog(`You have won game ${numGame}`,`Game ${numGame}`);
        setGameStarted(false);
      }
      else{
        AlertErrorDialog("Your solution is wrong!!!",`Game ${numGame}`);
      }
    }
}
    const handleOnStart=()=>{
      if(socketService.socket)
      {
        gameServices.onStartGame(socketService.socket,()=>{
        setIsGameStarted(true);
        });
      }
    }
  const handleStartGame=()=>{
    if(socketService.socket)
    {
      gameServices.startGame(socketService.socket,roomName);
    }
  }
  const handleUpdateTimer=()=>
  {
   if(stopGame)
   { 
   if(socketService.socket)
   {
    gameServices.onTimerGame(socketService.socket,(noti,timer)=>{
      setTimeValue(true);
      setTimer(timer);
      alert(noti);
    }
    )
  }
}
}
  const endGame=()=>{
    if(socketService.socket)
    { 
      gameServices.endGame(socketService.socket,roomName);
    }
  }
  const handleStopGame=()=>{
        if(socketService.socket)
        { 
          gameServices.onEndGame(socketService.socket,(sign)=>{
            if(sign)
            { 
             var t=Array.from(window.localStorage.getItem('board').replaceAll(",",''));
             setBoardSolved(t);
             setStopGame(sign);
            }
          })
        }
  }
 
var initGameBoard=(list)=>{
    var boardd=list[0];
    var sol=list[1];
    var ar=[];
    var ar_puzzle=[];
    var ar_clickable=[];
    var ar_sol=[];
     for(let i=0;i<9;i++)
    { ar[i]=[];
      ar_puzzle[i]=[];
      ar_clickable[i]=[];
      ar_sol[i]=[];
      for(let j=0;j<9;j++)
      {
        if(boardd[i][j]!==0)
        {
          ar_puzzle[i][j]=true;
          ar[i][j]=boardd[i][j].toString();
          ar_clickable[i][j]=false;
        }
        else
        { 
          ar[i][j]='';
          ar_clickable[i][j]=true;
        }
        ar_sol[i][j]=sol[i][j].toString();
      }
    }  
     setBoard(ar);
     setSol1(ar_sol);
     var arr_copy=cloneDeep(ar);
     setGame1(arr_copy);
     emptyNote();
     setPuzzleButton(ar_puzzle);
     setIsClickable(ar_clickable);
     setGameStarted(true);
  }

useEffect(()=>{
  var current_user=localStorage.getItem('current_user');
  var roomName=localStorage.getItem('room_name');
  var token=localStorage.getItem('token');
  if(numGame===1)
  {
    gameServices.beginGame(socketService.socket,current_user);
    gameServices.sudokuPuzzle(socketService.socket,current_user).then((list)=>
    {
      initGameBoard(list);
    });
  }
  gameServices.onUpdateTimer(socketService.socket,async(update_state,num_game)=>{
   setGameStarted(update_state);
   AlertErrorDialog(`You have lose game ${num_game}`,`Game ${num_game}`);
  });
  gameServices.onUpdateScore(socketService.socket,async(first_player,second_player,sudoku_list,is_game_over,clear_user)=>{
  setFirstPlayerScore(first_player);
  setSecondPlayerScore(second_player);
   if (is_game_over===1)
    {
      var user_parse=JSON.parse(current_user);
      if (clear_user===user_parse.display_name)
      {
        AlertCheckDialog("You have won this fucking game","End Game");
      }
      else
      {
        AlertErrorDialog("You have lose this fucking game","End Game");
      }
      await delay(5000);
      getWaitingRoom(token,roomName);
      return;
     }
    else if(is_game_over===-1)
    {
           var user_parse=JSON.parse(current_user);
           if(clear_user===user_parse.display_name)
           {
            AlertCheckDialog("You have won because your opponent has been disconnected from the game.","End Game");
           }
           await delay(3000);
           getWaitingRoom(token,roomName);
           return;
    }   
   initGameBoard(sudoku_list);
   sethintClick(3);
   setNumGame(prev=>prev+1);
  });
  }
,[]);

  var handleClickCell=(row,column)=>
  { 
    var newValue=value;
    var temp_note=[...arrayNote];
    setIsClick(true);
    setRow(row);
    setColumn(column);
    var isCl=arrayCopy(isClickable);
    if(!isNote)
    { temp_note[row][column].splice(0,temp_note[row][column].length);
      setArrayNote(temp_note)
      if(newValue!==0&&isCl[row][column]===true)
      {
      let newArray=[...board];
      newArray[row][column]=(newValue.toString());
      setBoard(newArray);
      setIsClickable(isCl);
      if(checkLength(newArray)===81)
      { 
        checkWiner(newArray);
      }
      }
    }
    else{ 
      if(isCl[row][column]===true)
      {
      if(temp_note[row][column].includes(newValue))
      {
        temp_note[row][column].splice(temp_note[row][column].indexOf(newValue),1);
      }
      else{
        temp_note[row][column].push(newValue);
      }
      setArrayNote(temp_note);
    }
  }
  }
  var arrayCopy=(ar)=>
  {
    let ar1=[...ar]
    return ar1;
  };
  var handleButton=(name)=>{
      if(name==='New Game')
      {
        backToDefault();
      }
      else if(name==='Clear')
      {
          Clear(row,column);
      }
      else if(name==='Note')
      {
         Note();
      }
      else if(name==='Hint')
      {
        handleHintClick();
      }
      
  }
  const Clear=(row,column)=>
  {
      var newArray=arrayCopy(board);
      var isClick=arrayCopy(isClickable);
      var is_deletable=checkValidCoordinate(row,column,coordinateHint);
      if(!is_deletable)
      {
      newArray[row][column]='';
      setBoard(newArray);
      isClick[row][column]=true
      setIsClickable(isClick);
      }
  }

  const Note=()=>{
      setIsNote(!isNote);
  }

  const handleHintClick=()=>{
  
    if(hintClick>0)
   {
    sethintClick((prev)=>prev-1);
    var flag_board=false;
    let new_array=[...board];
    let coord_array=[...coordinateHint];
    var clickable_array=[...isClickable];
    if(hintClick%2===0)
    {
     for(let i=0;i<9;i++)
     {
      flag_board=false;
      for(let j=0;j<9;j++)
      {
        if(new_array[i][j]!==sol1[i][j])
        {
        new_array[i][j]=sol1[i][j];
        clickable_array[i][j]=false;
        let coord=`${i}:${j}`;
        coord_array.push(coord);
        flag_board=true;
        break;
        }
      }
    if(flag_board)
    {
      break;
    }
     }
    }
  else{
      for(let i=8;i>=0;i--)
      { 
        flag_board=false;
        for(let j=0;j<9;j++)
        { 
          if(new_array[i][j]!==sol1[i][j])
          { 
            new_array[i][j]=sol1[i][j];
            clickable_array[i][j]=false;
            let coord=`${i}:${j}`;
           coord_array.push(coord);
            flag_board=true;
            break;
          }
        }
        if(flag_board)
        {
          break;
        }
      }
    }
    setBoard(new_array);
    setIsClickable(clickable_array);
    setCoordinateHint(coord_array);
    if(checkLength(new_array)===81)
    { 
      checkWiner(new_array);
    }
   }
   else
   {
  AlertWarningDialog("You have used all of your hint","No more hint");
   }
  }
 

 var checkValidCoordinate=(rIndex:number,cIndex:number,coordinateArr)=>
 {  
  for(let i=0;i<coordinateArr.length;i++)
  {   
      var ele=coordinateArr[i];
      var ele_part=ele.split(':');
      var rowIdx=ele_part[0];
      var columnIdx=ele_part[1];
      if(parseInt(rowIdx)===rIndex && parseInt(columnIdx)===cIndex)
      { 
        return true;
      }
  } 
    return false;
}

  var randomNumber=(n)=>
  {
    return Math.floor((Math.random()*n+1));
  }
  const removeKDigits=(arr)=>
  {
    var count;
    count=2
    while(count!==0)
    {
      let cellId=randomNumber(81)-1
      var i;
      var j;
      i=Math.floor(cellId/9)  
      j=(cellId%9)
      if(j!==0)
      {
         j=j-1;
      }    
      if(arr[i][j]!==0)
      {
        count-=1
        arr[i][j]=0
      }
    }
   }
    return(
<BoardContainer>
  <div className="user_row">
    <div className="user_column" style={{color:"#fff"}}>
    <img
        src={firstPlayer.avatar}
        className="rounded-circle mb-3"
        style={{width:"120px"}}
        alt="Avatar1"
      />
      <h5 className="mb-2"><strong>{firstPlayer.display_name}</strong></h5>
      <h3 style={{color:'white'}}><strong>{firstPlayerScore}</strong></h3>
    </div>
    <div className="user_column" style={{textAlign:'center'}}>
    <img
        src="https://ik.imagekit.io/qlzt6djaz/vs-41922.png?updatedAt=1697434804822"
        className="rounded-circle mb-3"
        style={{width:"100px"}}
        alt="Avatar2"
      />
    </div>
    <div className="user_column" style={{textAlign:'right', color:'#fff'}}>
    <img
        src={secondPlayer.avatar}
        className="rounded-circle mb-3"
        style={{width:"120px"}}
        alt="Avatar"
      />
      <h5 className="mb-2"><strong>{secondPlayer.display_name}</strong></h5>
      <h3 style={{color:'white'}}><strong>{secondPlayerScore}</strong></h3>
    </div>
    </div>
   <Timer isGameStarted={gameStarted}/> 
    <h2>Game {numGame}</h2>
    <Table>
       <tbody>
           {
               board.map((row,rIndex)=>{
                   return(
                       <tr key={rIndex}>
                         {row.map((column,cIndex)=>{
                             return(<Td key={cIndex+rIndex} className="puzzleNumber" onClick={()=>handleClickCell(rIndex,cIndex)}>
                                {(!puzzleButton[rIndex][cIndex])?(((rIndex+1)%3===0&&(cIndex+1)%3===0)?<SquareBottomRight style={{color:checkValidCoordinate(rIndex,cIndex,coordinateHint)?'red':'black'}}>{column===''?arrayNote.map((r,rI)=>{return(r.map((c,cI)=>{return((cI===cIndex&&rI===rIndex)&&c.map((d,dI)=>{return(<NoteBox>{d}</NoteBox>)}))}))}):column}</SquareBottomRight>:(rIndex+1)%3===0?<SquareBottom style={{color:checkValidCoordinate(rIndex,cIndex,coordinateHint)?'red':'black'}}>{column===''?arrayNote.map((r,rI)=>{return(r.map((c,cI)=>{return((cI===cIndex&&rI===rIndex)&&c.map((d,dI)=>{return(<NoteBox>{d}</NoteBox>)}))}))}):column}</SquareBottom>:((cIndex+1)%3===0)?<SquareRight style={{color:checkValidCoordinate(rIndex,cIndex,coordinateHint)?'red':'black'}}>{column===''?arrayNote.map((r,rI)=>{return(r.map((c,cI)=>{return((cI===cIndex&&rI===rIndex)&&c.map((d,dI)=>{return(<NoteBox>{d}</NoteBox>)}))}))}):column}</SquareRight>:<Square style={{color:checkValidCoordinate(rIndex,cIndex,coordinateHint)?'red':'black'}}>{column===''?arrayNote.map((r,rI)=>{return(r.map((c,cI)=>{return((cI===cIndex&&rI===rIndex)&&c.map((d,dI)=>{return(<NoteBox>{d}</NoteBox>)}))}))}):column}</Square>):(((rIndex+1)%3===0&&(cIndex+1)%3===0)?<SquareBottomRightColor>{column===''?arrayNote.map((r,rI)=>{return(r.map((c,cI)=>{return((cI===cIndex&&rI===rIndex)&&c.map((d,dI)=>{return(<NoteBox>{d}</NoteBox>)}))}))}):column}</SquareBottomRightColor>:(rIndex+1)%3===0?<SquareBottomColor>{column===''?arrayNote.map((r,rI)=>{return(r.map((c,cI)=>{return((cI===cIndex&&rI===rIndex)&&c.map((d,dI)=>{return(<NoteBox>{d}</NoteBox>)}))}))}):column}</SquareBottomColor>:((cIndex+1)%3===0)?<SquareRightColor>{column===''?arrayNote.map((r,rI)=>{return(r.map((c,cI)=>{return((cI===cIndex&&rI===rIndex)&&c.map((d,dI)=>{return(<NoteBox>{d}</NoteBox>)}))}))}):column}</SquareRightColor>:<SquareColor>{column===''?arrayNote.map((r,rI)=>{return(r.map((c,cI)=>{return((cI===cIndex&&rI===rIndex)&&c.map((d,dI)=>{return(<NoteBox>{d}</NoteBox>)}))}))}):column}</SquareColor>)}
                             </Td>);
                         })}
                       </tr>
                   );
               })
           }
      </tbody>
    </Table>
    <ChangeButton setClickValue={setValue} selected={value}/>
    <Button handlePress={handleButton} isNote={isNote} hint_count={hintClick}/>
</BoardContainer>);
}
export default SudokuBoard;