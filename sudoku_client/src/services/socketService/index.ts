import {io,Socket} from "socket.io-client"
class SocketService{
    public socket:Socket|null=null;
    public connect(url:string):Promise<Socket>{
        return new Promise((rs,rj)=>{
            
            this.socket=io(url,{multiplex:false});
            if(!this.socket)
            {
                return rj();
            }
        this.socket.on("connect",()=>{rs(this.socket as Socket)})
        this.socket.off("connect_error",(err)=>{alert(err);console.log("Connection error");rj(err);})
        })
    }
}
export default new SocketService();