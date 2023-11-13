import React from "react";
import { Socket } from "socket.io-client";
import { ISudokuBoard } from "../../components/sudokuBoard";
import { List } from "reactstrap";
class gameServices{
public async joinGameRoom(socket:Socket,roomId:String):Promise<boolean>
{
    return new Promise((rs,rj)=>{
        socket.emit("join_game",{roomId});
        socket.on("join_room",({join})=>{rs(true)});
        socket.on("room_join_error",({error})=>{rj(error)});
    });
}
public async updateGame(socket:Socket,board:ISudokuBoard,solveBoard:any[],roomName:string)
{
socket.emit("update_game",{gameBoard:board,solved:solveBoard,room:roomName});
}
public async onUpdateGame(socket:Socket,listener:(gameBoard:ISudokuBoard,solved:any[])=>void)
{
socket.on('on_update_game',({gameBoard,solved})=>listener(gameBoard,solved));
}
public async countMemberRoom(socket:Socket,roomName:String):Promise<number>
{
    return new Promise((rs,rj)=>{
        socket.emit("count_mem",{roomName});
        socket.on("number_member",({nums})=>{rs(nums);})
    })
}

public async updateUserRoom(socket:Socket,user:string,level:string):Promise<any>
{ 
  return new Promise((rs,rj)=>{
    socket.emit("user_room",{user,level});
    socket.on("update_user_room",({user,level})=>{var list=[];list.push(user);list.push(level);rs(list);});
  });
}

public async updateOwnUser(socket:Socket,user:string)
{   
    return new Promise((rs,rj)=>{
     socket.emit("first_user",{user});
     socket.on("update_first_user",({user,slot})=>{var list=[];list.push(user);list.push(slot);rs(list)});
    });
}

public async updateReadyState(socket:Socket,ready_state:boolean)
{
   
   socket.emit("ready_state",{ready_state});
}
public async onUpdateReadyState(socket:Socket,listener:(ready_state:boolean)=>void)
{
     socket.on('update_ready_state',({ready_state})=>listener(ready_state));
}

public async logoutRoom(socket:Socket,user:string)
{
  socket.emit("leave_room",{user});
}

public async onLogoutRoom(socket:Socket,listener:(slot:string)=>void)
{
    socket.on('on_leave_room',async({slot})=>listener(slot));
}
public async popupModal(socket:Socket,popup:boolean,game_level)
{
    socket.emit('popup_modal',{popup,game_level});
}
public async onPopupModal(socket:Socket,listener:(popup:boolean)=>void)
{
    socket.on('on_popup_modal',({popup})=>listener(popup));
}
public async roomUser(socket:Socket,user:string):Promise<string>
{
    return new Promise((rs,rj)=>{
      socket.emit("room_user",{user});
      socket.on("room_user_update",({user})=>{rs(user)});
    });
}

public async multiplayerStatistic(socket:Socket,user_name:string)
{
  return new Promise((rs,rj)=>{
try
{ 
  socket.emit("multi_statistic",{user_name});
  socket.on("on_multi_statistic",({easy_win,easy_lose})=>{var list=[];list.push(easy_win);list.push(easy_lose);rs(list)});
}
catch(err)
{
    alert(err);
    rj(err);
}
});
}

public async h2hUser(socket:Socket,roomName:string):Promise<any>
{
    return new Promise((rs,rj)=>
    {
     socket.emit("h2h_user",{roomName});
     socket.on("h2h_res",({score})=>{rs(score);});
    });
}

public async sudokuPuzzle(socket:Socket,user:string):Promise<any>
{
   return new Promise((rs,rj)=>{
    socket.emit("sudoku_game",{user});
    socket.on("update_sudoku_game",({board,sol})=>{var list=[];list.push(board,sol);rs(list);});
   });
}
public async singleSudokuPuzzle(socket:Socket,level:string):Promise<any>
{
    return new Promise((rs,rj)=>{
        socket.emit("single_board",{level});
        socket.on("on_single_board",({board,sol})=>{var list=[];list.push(board,sol);rs(list);})
    });
}


public async updateScore(socket:Socket,user:string,message:string,first_player:string,second_player:string)
{
 socket.emit("update_score",{user:user,game_num:message,first_player:first_player,second_player:second_player});  
}

public async onUpdateScore(socket:Socket,listener:(first_player:number,second_player:number,sudoku_list:List,is_game_over:number,clear_user:string)=>void)
{
    socket.on("on_update_score",({first_player,second_player,sudoku_list,is_game_over,clear_user})=>listener(first_player,second_player,sudoku_list,is_game_over,clear_user));
}

public async updateSingleBoard(socket:Socket,username:string,level:string,time_completed:string)
{
    socket.emit('update_single_board',{username:username,level:level,time_complete:time_completed});
}

public async updateTimer(socket:Socket,update_state:boolean,num_game:number)
{ 
    socket.emit("update_timer",{update_state:update_state,num_game:num_game});
}

public async onUpdateTimer(socket:Socket,listener:(update_state:boolean,num_game:number)=>void)
{
    socket.on('on_update_timer',({update_state,num_game})=>listener(update_state,num_game));
}

public async updateLevel(socket:Socket,level:string)
{
    socket.emit("update_level",{update_level:level});
}

public async onUpdateLevel(socket:Socket,listener:(update_level:string)=>void)
{
    socket.on("on_update_level",({update_level})=>listener(update_level));
}

public async beginGame(socket:Socket,user:string)
{
    socket.emit("user_info",{user});
}
public async startGame(socket:Socket,roomName:string)
{
    socket.emit("start_game",{room:roomName});
}
public async onStartGame(socket:Socket,listener:()=>void)
{
    socket.on('on_start_game',listener);
}
public async timerGame(socket:Socket,roomName:string,timer:string)
{
    socket.emit("timer_game",{room:roomName,timeValue:timer});
}
public async onTimerGame(socket:Socket,listener:(noti:string,timer:string)=>void)
{
    socket.on("on_timer_game",({noti,timer})=>listener(noti,timer));
}
public async endGame(socket:Socket,roomName:string)
{
    socket.emit("end_game",{room:roomName});
}
public async onEndGame(socket:Socket,listener:(sign:boolean)=>void)
{
    socket.on("on_end_game",({sign})=>listener(sign));
}

}
export default new gameServices();