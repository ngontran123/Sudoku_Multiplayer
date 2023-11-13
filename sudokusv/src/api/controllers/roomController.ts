import { ConnectedSocket, MessageBody, OnMessage, SocketController, SocketIO } from "socket-controllers"
import {Server} from "socket.io"
import {Socket} from "socket.io"
import socket from "../../socket"
@SocketController()
export class RoomController{
    private getSocketGameRoom(socket:Socket)
    {
        const socket1=Array.from(socket.rooms.values()).filter((m)=>m!=socket.id)
        const gameRoom=socket1&&socket1[0]
        return gameRoom;
    }
@OnMessage("join_game")
public async joinGame(@SocketIO() io:Server,@ConnectedSocket() socket:Socket,@MessageBody() message:any)
{
    console.log("New user has joined room:",message.roomId);
    const connectedSocket=io.sockets.adapter.rooms.get(message.roomId);
    const socketRoom=Array.from(socket.rooms.values()).filter((r)=>{r!==socket.id})
    if(socketRoom.length>0||(connectedSocket&&connectedSocket.size>=2))
    {
        socket.emit("room_join_error",{
            error:"The room is full"
        });
    }
    else
    {   
        await socket.join(message.roomId);
        socket.emit("join_room",{
            join:"You have joined the room"
        });
    }
}
@OnMessage("count_mem")
public async countMember(@SocketIO() io:Server,@ConnectedSocket() socket:Socket,@MessageBody() message:any)
{
    const num_of_connected=io.sockets.adapter.rooms.get(message.roomName).size;
    console.log("Number of connected:"+num_of_connected);
    socket.emit("number_member",{nums:num_of_connected});
}
@OnMessage("start_game")
public async startGame(@SocketIO() io:Server,@ConnectedSocket() socket:Socket,@MessageBody() message:any)
{
     if(io.sockets.adapter.rooms.get(message.room).size===2)
    {   console.log("This has connected:"+socket.id);
        socket.emit("on_start_game");
        socket.to(this.getSocketGameRoom(socket)).emit("on_start_game");
    }
}


}