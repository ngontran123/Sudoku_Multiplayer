import { ConnectedSocket, MessageBody, OnConnect, SocketController, SocketIO } from "socket-controllers";
import { Server, Socket } from "socket.io";
@SocketController()
export class MainController
{
@OnConnect()
public onConnection(@ConnectedSocket() socket:Socket,@SocketIO() io:Server,@MessageBody() message:any)
{
console.log("New socket is connected: ",socket.id);
}
}
 
