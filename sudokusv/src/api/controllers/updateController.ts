import { ConnectedSocket, MessageBody, OnMessage, SocketController, SocketIO } from "socket-controllers"
import { Server, Socket } from 'socket.io';
import { SudokuPuzzle } from "../../sudoku_puzzle";
import { ServiceHelper } from "../../service_helpers";
import { SrvRecord } from "dns";
import { DateTime } from 'luxon';
import {user,question_level,room_user,user_room_detail, single_board_detail} from '../../models/user_model';
var room=[];
var sol=[];
var first_user=[];
var second_user=[];
var count_game=[];
var first_come_user=[];
var user_score=[];
var level_room=[];

var cloneDeep=require('lodash.clonedeep');
@SocketController()
export class UpdateController
{  
    private getSocketGameRoom(socket:Socket)
    {
        const socket1=Array.from(socket.rooms.values()).filter((m)=>m!=socket.id)
        const gameRoom=socket1&&socket1[0]
        return gameRoom;
    }
    private getSocketId(@ConnectedSocket() io:Server,socket:Socket,roomName:string)
    { 
      var clientsInRoom =Array.from(io.sockets.adapter.rooms).filter((id)=>id[0]!=socket.id&&id[0]!=roomName);
      const socketIds = clientsInRoom[0][0];
      return socketIds;
    }
    private getSudokuPuzzle(remove_k:number)
    {
      var sudoku_puzzle=new SudokuPuzzle(9,80);
      sudoku_puzzle.fillValues();
      var sudoku_data=sudoku_puzzle.arr.filter(function(e){return e!==undefined });
      var sudoku_helpers=new ServiceHelper();
      var clone_sudoku=cloneDeep(sudoku_data);
      var sudoku_filter=sudoku_helpers.removeKDigits(sudoku_data,remove_k);
      var sudoku_couple=[];
      sudoku_couple.push(sudoku_filter);
      sudoku_couple.push(clone_sudoku);
      return sudoku_couple;
    }
    private getGameLevel(level:string)
    { 
      var val=0;
      switch(level)
      {
        case 'Easy':val=40;break;
        case 'Medium':val=50;break;
        case 'Hard':val=60;break;
        case 'Extreme':val=65;break;
      }
      return val;
    }

    private getIdGameLevel(level:string)
    {
      var id_level=0;
      switch(level)
      {
        case 'Easy':id_level=1;break;
        case 'Medium':id_level=2;break;
        case 'Hard':id_level=3;break;
        case 'Extreme':id_level=4;break;
      }
      return id_level;
    }
    private delay(ms: number) {
      return new Promise( resolve => setTimeout(resolve, ms) );
  }
    @OnMessage("update_game")
    public async updateGame(@ConnectedSocket() socket:Socket,@SocketIO() io:Server,@MessageBody() message:any)
    {
      const size=io.sockets.adapter.rooms.get(message.room).size;
      if(size<=1)
      {
        room[message.room]=message.gameBoard;
        sol[message.room]=message.solved;
      }
      else{
        console.log(room[message.room]);
        console.log(sol[message.room]);
        socket.emit("on_update_game",{gameBoard:room[message.room],solved:sol[message.room]});
      }
    }
    @OnMessage("timer_game")
    public async timerGame(@ConnectedSocket() socket:Socket,@SocketIO() io:Server,@MessageBody() message:any)
    { const gameRoom=this.getSocketGameRoom(socket);
      console.log("fuck"+message.timeValue);
      console.log(message.room);
      socket.to(gameRoom).emit("on_timer_game",{noti:"You have lose",timer:message.timeValue});
      socket.emit("on_timer_game",{noti:"You have won",timer:message.timeValue});
    }
    @OnMessage("end_game")
    public async endGame(@ConnectedSocket() socket:Socket,@SocketIO() io:Server,@MessageBody() message:any)
    {
      const gameRoom=this.getSocketGameRoom(socket);
      socket.to(gameRoom).emit("on_end_game",{sign:true});
      socket.emit("on_end_game",{sign:true});
    }
    @OnMessage("user_room")
    public async userRoom(@ConnectedSocket() socket:Socket,@SocketIO() io:Server,@MessageBody() message:any)
    {
      const gameRoom=this.getSocketGameRoom(socket);
      const size=io.sockets.adapter.rooms.get(gameRoom).size;
      console.log("User passed up:"+message.user);
      if(size<=1)
      {
      first_user[gameRoom]=message.user
      level_room[gameRoom]=message.level;
      }
      else
      {
      if(message.user!=first_user[gameRoom])
      {
      second_user[gameRoom]=message.user;
      }
      var socket_id=this.getSocketId(io,socket,gameRoom);
      console.log("current_socket_id:"+socket_id);
      console.log("first user:"+first_user[gameRoom]);
      var user_parse=JSON.parse(message.user);
      var game_room_parse=JSON.parse(first_user[gameRoom]);     
      if((user_parse.display_name)!=(game_room_parse.display_name))
      {
      socket.to(gameRoom).emit('update_user_room',{user:message.user,level:message.level});
      }
    }  
  }
 
    @OnMessage("first_user")
    public async firstUser(@ConnectedSocket() socket:Socket,@MessageBody() message:any)
    { const gameRoom=this.getSocketGameRoom(socket);      
      var user_parse=JSON.parse(message.user);
      var game_room_parse=JSON.parse(first_user[gameRoom]);
      if((user_parse.display_name)!=(game_room_parse.display_name))
      {
      socket.emit('update_first_user',{user:first_user[gameRoom],slot:'2'});
      }
      else
      {
      socket.emit('update_first_user',{user:second_user[gameRoom],slot:'1'});
      }
    }
    @OnMessage("ready_state")
    public async readyState(@ConnectedSocket() socket:Socket,@MessageBody() message:any)
    {
      const gameRoom=this.getSocketGameRoom(socket);
      var ready_state=message.ready_state;
      socket.to(gameRoom).emit('update_ready_state',{ready_state:ready_state});
    }
    
    @OnMessage("leave_room")
    public async leaveRoom(@ConnectedSocket() socket:Socket,@SocketIO() io:Server,@MessageBody() message:any)
    {
      const gameRoom=this.getSocketGameRoom(socket);
      socket.leave(gameRoom);
      socket.to(gameRoom).emit("on_leave_room",{slot:"2"});
    }
    @OnMessage("popup_modal")
    public async popupModal(@ConnectedSocket() socket:Socket,@MessageBody() message:any)
    {
      const gameRoom=this.getSocketGameRoom(socket);
      level_room[gameRoom]=message.game_level;
      socket.to(gameRoom).emit('on_popup_modal',{popup:message.popup});
    }

@OnMessage("room_user")
public async roomUser(@SocketIO() io:Server,@ConnectedSocket() socket:Socket,@MessageBody() message:any)
{    console.log("user here:"+message.user);
     const gameRoom=this.getSocketGameRoom(socket);
     socket.to(gameRoom).emit('room_user_update',{user:message.user});
}

@OnMessage("h2h_user")
public async h2hUser(@SocketIO() io:Server,@ConnectedSocket() socket:Socket,@MessageBody() message:any)
{
  var size=io.sockets.adapter.rooms.get(message.roomName).size;
  if(size==2)
  { 
    var first_user_id=JSON.parse(first_user[message.roomName])._id;
    var second_user_id=JSON.parse(second_user[message.roomName])._id;
    console.log("user_id:"+typeof(first_user_id));
    console.log("second_id:"+typeof(second_user_id));
    var contain_user=await user_room_detail.aggregate([
      {
        $group:
        {
          _id:"$room_id",
          "user_id_push":{$push:"$user_id"}
        }},
        {
        $match:{
          "user_id_push":{
            $all:[first_user_id,second_user_id]
          }
        }
      }
    ]).exec((err,db)=>{
    try{
      
      if(err)
      {
        throw err;
      }
      var num_match=db.length;
      if(num_match>0)
      {
        var room_id_arr=[];
       for(let i=0;i<num_match;i++)
       {
        room_id_arr.push(db[i]._id);
       }
       console.log("All room id:"+room_id_arr);
       user_room_detail.countDocuments({
             status:"Win",
             room_id:{$in:room_id_arr},
             user_id:first_user_id
      },(err,count)=>{
        if(err)
        {
          console.log("There is error during count the document:"+err);
        }
        else{
          console.log("The number of winner here is:",count);
          var remain_score=num_match-count;
          var main_score=`${count}-${remain_score}`
          io.to(message.roomName).emit("h2h_res",{score:main_score});
        }
      });
      }
    }
    catch(err)
    {
      console.log('There is error during finding h2h');
      return err;
    }
    });
    
  }
}
@OnMessage("user_info")
public async userInfo(@ConnectedSocket() socket:Socket,@MessageBody() message:any)
{ 
  console.log("already here");
  
  var user_parse=JSON.parse(message.user);
  
  var gameRoom=this.getSocketGameRoom(socket);
  
  user_score[`${gameRoom}_${user_parse.display_name}`]=0;
  
  for(let i=1;i<=3;i++)
  {
    count_game[`${gameRoom}_${i}`]=0;
  }
  console.log(`${user_parse.display_name} score is:${user_score[`${gameRoom}_${user_parse.display_name}`]}`);
}

@OnMessage("single_board")
public async singleBoard(@ConnectedSocket() socket:Socket,@MessageBody() message:any)
{
  var level=message.level;
  var sudoku_puzzle=new SudokuPuzzle(9,80);
  sudoku_puzzle.fillValues();
  var sudoku_data=sudoku_puzzle.arr.filter(function(e){return e!==undefined });
  var sudoku_helpers=new ServiceHelper();
  var clone_sudoku=cloneDeep(sudoku_data);
  var remove_num=this.getGameLevel(level);
  console.log("the number removed is:"+remove_num);
  var sudoku_filter=sudoku_helpers.removeKDigits(sudoku_data,2);
  socket.emit("on_single_board",{board:sudoku_filter,sol:clone_sudoku});
}

@OnMessage("sudoku_game")
public async sudokuGame(@SocketIO() io:Server,@ConnectedSocket() socket:Socket,@MessageBody() message:any)
{ 
 const gameRoom=this.getSocketGameRoom(socket);
 const size=io.sockets.adapter.rooms.get(gameRoom).size;
 console.log('the level for this game is:'+level_room[gameRoom]);
 if(size==2)
  var sudoku_puzzle=new SudokuPuzzle(9,80);
  sudoku_puzzle.fillValues();
  var sudoku_data=sudoku_puzzle.arr.filter(function(e){return e!==undefined });
  var sudoku_helpers=new ServiceHelper();
  var clone_sudoku=cloneDeep(sudoku_data);
  var remove_num=this.getGameLevel(level_room[gameRoom]);
  console.log("the number removed is:"+remove_num);
  var sudoku_filter=sudoku_helpers.removeKDigits(sudoku_data,2);
  var user=JSON.parse(message.user);
  var first_user_parse=JSON.parse(first_user[gameRoom]);
  if(user.display_name===first_user_parse.display_name)
  {
    console.log("sudoku_data:"+sudoku_helpers.convert2DArray(clone_sudoku));
    io.to(gameRoom).emit('update_sudoku_game',{board:sudoku_filter,sol:clone_sudoku});
  }
 }

@OnMessage("update_level")
public async updateLevel(@SocketIO() io:Server,@ConnectedSocket() socket:Socket,@MessageBody() message:any)
{
  const gameRoom=this.getSocketGameRoom(socket);
  socket.to(gameRoom).emit("on_update_level",{update_level:message.update_level});
}

@OnMessage("update_timer")
public async updateTimer(@SocketIO() io:Server,@ConnectedSocket() socket:Socket,@MessageBody() message:any)
{
  const gameRoom=this.getSocketGameRoom(socket);
  const size=io.sockets.adapter.rooms.get(gameRoom).size;
  if(size==2)
  { console.log("did come here timer"+message.update_state);
    socket.to(gameRoom).emit("on_update_timer",{update_state_timer:message.update_state,num_game:message.num_game});
  }
}

@OnMessage("multi_statistic")
public async multiStatistic(@ConnectedSocket() socket:Socket,@MessageBody() message:any)
{
  console.log("game multi:"+message.user_name);
  console.log("fuck");    
  var user_name=message.user_name;
  var user_exist=await user.findOne({username:user_name});
  var user_id=user_exist._id;
  var room_handle=await room_user.aggregate([
    {
        $group:{
          _id:"$_id",
          "level_push":{$push:"$level_id"}
        }
    },
    {
       $match:
       {
           "level_push":
           {
            $all:[this.getIdGameLevel("Easy")]
           }
       }
    }
  ]).exec((err,db)=>{
    if(err)
    {
      throw(err);
    }
    var num=db.length;
    if(num>0)
    { 
      var rooms=[];
      for(let i=0;i<num;i++)
      {
       rooms.push(db[i]._id);
      }
      var count_win=user_room_detail.countDocuments({
         user_id:user_id,
         room_id:{$in:rooms},
         status:"Win"
      },(err,count)=>{
        var num_lose=rooms.length-count;
        socket.emit("on_multi_statistic",{easy_win:count,easy_lose:num_lose});
      });
    }
  }); 
}

@OnMessage("update_single_board")
public async updateSingleBoard(@ConnectedSocket() socket:Socket,@MessageBody() message:any)
{
  var level=message.level;
  var level_id=this.getIdGameLevel(level);
  var username=message.username;
  var user_exist=await user.findOne({username:username});
  var user_id=-1;
  var time_completed=message.time_complete;
  if(user_exist!=null)
  {
   user_id=user_exist._id;
  }
  var single_record=
  {
   level_id:level_id,
   user_id:user_id,
   time_complete:time_completed
  };
  var create_single_record=new single_board_detail(single_record);
  try
  {
      create_single_record.save((err,doc)=>{
        if(err)
        {
          throw err;
        }
      console.log("Created an new single record for:"+username);
      })
  }
  catch(err)
  {
    console.log("Error while save single record:"+err);
    return;
  }
  
}

@OnMessage("update_score")
public async updateScore(@SocketIO() io:Server,@ConnectedSocket() socket:Socket,@MessageBody() message:any)
{ 
  const gameRoom=this.getSocketGameRoom(socket);
  const size=io.sockets.adapter.rooms.get(gameRoom).size;
  var user_parse=JSON.parse(message.user);
  var clear_user='';
  if(size==2)
  {
  if(count_game[`${gameRoom}_${message.game_num}`]==0)
  {
  count_game[`${gameRoom}_${message.game_num}`]+=1;
  
  user_score[`${gameRoom}_${user_parse.display_name}`]+=1;

  var remove_num=this.getGameLevel(level_room[gameRoom]);

  var next_sudoku_puzzle=this.getSudokuPuzzle(2);
  
  var is_game_over=0;

  if(user_score[`${gameRoom}_${user_parse.display_name}`]==2)
  {
    is_game_over=1;
    clear_user=user_parse.display_name;
    var id_level=this.getIdGameLevel(level_room[gameRoom]);
    
    var another_player=Object.keys(user_score).filter((k)=>k.includes(gameRoom) && !k.includes(user_parse.display_name));
    
    var score=`${user_score[`${gameRoom}_${user_parse.display_name}`]}-${user_score[`${another_player[0]}`]}`
    
    var created_room=
    {
     room_name:gameRoom,
    
     created_date:DateTime.now().toLocaleString(DateTime.DATETIME_FULL),
    
     level_id:id_level,
    
     score:score
    }
    const create_user_room=new room_user(created_room);
    try
    {
    create_user_room.save((err,doc)=>{
      if(err)
      {
        console.log("Create room has error:"+err);
        throw err;
      }
    else{
      console.log(`Created room ${gameRoom} done.`);
    }
    });
    }
    catch(error)
    {
      return;
    }
    var second_player=another_player[0].split('_');
   
    console.log("another player:"+second_player);
   
    var second_player_name=second_player[1];
   
    console.log("another_player_name:"+second_player_name);

    await this.delay(2000);
   
    var status_first_player=await user.findOne({display_name:user_parse.display_name});
   
    var status_second_player=await user.findOne({display_name:second_player_name});
   
    var status_first_player_id=status_first_player._id;
   
    var status_second_player_id=status_second_player._id;
   
    var latest_room=await room_user.findOne().sort({$natural:-1}).limit(1);
   
    var latest_room_id=latest_room._id;
   
    console.log("latest room id is:"+latest_room_id);
   
    var first_user_room=
    {
      room_id:latest_room_id,
     
      user_id:status_first_player_id,
     
      status:'Win'
    };
    var second_user_room=
    {
      room_id:latest_room_id,
     
      user_id:status_second_player_id,
     
      status:'Lose'
    };
    console.log("first_user_room:"+first_user_room);
   
    console.log("second_user_room:"+second_user_room);
   
    const add_first_user_room=new user_room_detail(first_user_room);
   
    const add_second_user_room=new user_room_detail(second_user_room);
   
    add_first_user_room.save((err,doc)=>{
  try{
    if(err)
    { 
      console.log('Add first user error:'+err);
      
      throw err;
    }
    console.log('Add first user record to db done.');
  }
  catch(err)
  { console.log('Add second user error:'+err);
    
  return;
  }
   });

   add_second_user_room.save((err,doc)=>
   {
  try{
   if(err)
   {
    console.log('Add second user error:'+err);
    throw err;
   }
   console.log('Add second user record to db done.');
  }
  catch(err)
  {
    console.log('Add second user error');
    return;
  }
});
  }
  io.to(gameRoom).emit('on_update_score',{first_player:user_score[`${gameRoom}_${message.first_player}`],second_player:user_score[`${gameRoom}_${message.second_player}`],sudoku_list:next_sudoku_puzzle,is_game_over:is_game_over,clear_user:clear_user});
  }
  }
  else
  { var id_level=this.getIdGameLevel(level_room[gameRoom]);
    
    var another_player=Object.keys(user_score).filter((k)=>k.includes(gameRoom) && !k.includes(user_parse.display_name));
    
    var created_room=
    {
     room_name:gameRoom,
    
     created_date:DateTime.now().toLocaleString(DateTime.DATETIME_FULL),
    
     level_id:id_level,
    
     score:'3-0'
    }
    const create_user_room=new room_user(created_room);
    try
    {
    create_user_room.save((err,doc)=>{
      if(err)
      {
        console.log("Create room has error:"+err);
        return;
      }
    else
    {
     console.log(`Created room ${gameRoom} done.`);
    }
    });
    }
    catch(error)
    {
      return;
    }
    var second_player=another_player[0].split('_');
    
    console.log("another player:"+second_player);
    
    var second_player_name=second_player[1];
    
    console.log("another_player_name:"+second_player_name);
    
    await this.delay(2000);

    var status_first_player=await user.findOne({display_name:user_parse.username});
    
    var status_second_player=await user.findOne({display_name:second_player_name});
 
    var status_first_player_id=status_first_player._id;
    
    console.log("first_user_id:"+status_first_player_id);
    
    var status_second_player_id=status_second_player._id;
    
    console.log("first_user_id:"+status_second_player_id);
    
    var latest_room=await room_user.findOne().sort({$natural:-1}).limit(1);
    
    var latest_room_id=latest_room._id;
    
    console.log("latest room id is:"+latest_room_id);
    
    var first_user_room =
    {
    
      room_id:latest_room_id,
    
      user_id:status_first_player_id,
    
      status:'Win'
    };
    var second_user_room =
    {
      room_id:latest_room_id,
      
      user_id:status_second_player_id,

      status:'Lose'
    };
    console.log("first_user_room:"+first_user_room);
    console.log("second_user_room:"+second_user_room);
   
    const add_first_user_room=new user_room_detail(first_user_room);
   
   const add_second_user_room=new user_room_detail(second_user_room);
   
   add_first_user_room.save((err,doc)=>{
  try{
    if(err)
    {
      throw err;
    }
    console.log('Add first user record to db done.');
  }
  catch(err)
  {
    console.log('Add first user error:'+err);
    return;
  }
   });
   add_second_user_room.save((err,doc)=>
   {
  try
  {
   if(err)
   {
    throw err;
   }
   console.log('Add second user record to db done.');
  }
  catch(err)
  {
    console.log('Add second user error');
    return;
  }
});
    clear_user=user_parse.display_name;
    
    io.to(gameRoom).emit('on_update_score',{first_player:user_score[`${gameRoom}_${message.first_player}`],second_player:user_score[`${gameRoom}_${message.second_player}`],sudoku_list:next_sudoku_puzzle,is_game_over:-1,clear_user:clear_user});
  }
}
}