import React from 'react';
import { Card, CardBody, CardTitle, CardText, CardImg,Button,UncontrolledDropdown,DropdownToggle,DropdownItem,DropdownMenu} from 'reactstrap';
import WaitingRoomUser from '../user_waiting_info';
import {useState,useEffect,useContext} from 'react';
import gameContext from '../../gameContext';
import gameServices from '../../services/gameServices';
import socketService from '../../services/socketService';
import { getWaitingRoom, joiningRoom } from '../../services/apiService/api';
import PopupModal from '../popup';
import ChangeLevel from '../changeLevel';
const WaitingRoom=()=>
{
 const defaultPlayer=
 {
  display_name:'',
  gender:'',
  motto:'',
  avatar:'https://ik.imagekit.io/qlzt6djaz/user.png'
 };
 const {roomName,setRoomName}=useContext(gameContext);
 const [firstPlayer,setFirstPlayer]=useState(defaultPlayer);
 const [secondPlayer,setSecondPlayer]=useState(defaultPlayer);
 const [notReady,setNotReady]=useState(true);
 const [showPopup,setShowPopup]=useState(false);
 const [levelTitle,setLevelTitle]=useState('Easy');
 const [h2hTitle,setH2HTitle]=useState('');
 const {isInRoom,setIsInRoom}=useContext(gameContext);
useEffect(()=>{
        setRoomName(localStorage.getItem('room_name'));
        const socket=socketService.socket;
        if(!socket)
        {
            return;
        }
        const joined=gameServices.joinGameRoom(socket,roomName).catch((error)=>{alert(error);});
        var current_user=JSON.parse(localStorage.getItem('current_user'));
        gameServices.countMemberRoom(socket,roomName).then((val)=>{
          if(val===1)
          { 
          setFirstPlayer(current_user);
          }
        else 
        { 
          gameServices.updateOwnUser(socket,JSON.stringify(current_user)).then((res)=>{
            var slot=res[1];
            var user_update=res[0];
            if(slot==='2')
            {
            setSecondPlayer(current_user);
            localStorage.setItem('second_user',user_update);
            var converted_user=JSON.parse(user_update);
            setFirstPlayer(converted_user); 
            }
            else
            {
              setFirstPlayer(current_user);
              var converted_user=JSON.parse(user_update);
              localStorage.setItem('second_user',JSON.stringify(current_user));
              setSecondPlayer(converted_user);
            }
          });
        }
        });
        gameServices.updateUserRoom(socket,JSON.stringify(current_user),levelTitle).then((res)=>{
          var user=res[0];
          var level=res[1];
          var converted_user=JSON.parse(user);
          setSecondPlayer(converted_user);
          setLevelTitle(level);
          });
       handleH2HScore();
       handleUpdateReadyState();
       handleLeaveRoom();
       handleOnPopupModal();
       handleUpdateLevel();
   }
,[]);

var handleH2HScore=()=>
{ 
  gameServices.h2hUser(socketService.socket,roomName).then((res)=>
  {
    setH2HTitle(res);
  });
}

var handleUpdateReadyState=()=>
{
  gameServices.onUpdateReadyState(socketService.socket,(ready_state)=>{
    setNotReady(ready_state);
  });
}
var handleUpdateLevel=()=>{
  gameServices.onUpdateLevel(socketService.socket,async(update_level)=>{
    setLevelTitle(update_level);
  })
}
var toggleReady=()=>
{
   setNotReady(current=>!current); 
   const socket=socketService.socket;
   if(!socket)
   {
       return;
   }
gameServices.updateReadyState(socket,!notReady);
};

var leaveRoom=async()=>
{ var user=localStorage.getItem('current_user');
  gameServices.logoutRoom(socketService.socket,user);
  var token_ob={
    token:localStorage.getItem('token')
  };
  await joiningRoom(token_ob);
}

var handleLeaveRoom=()=>
{
   gameServices.onLogoutRoom(socketService.socket,async(slot)=>{
   var token=localStorage.getItem('token');
   await getWaitingRoom(token,roomName);
   });
}

const handleShowPopup=()=>
{ localStorage.setItem('game_level',levelTitle);
  setShowPopup(prev=>!prev);
  gameServices.popupModal(socketService.socket,!showPopup,levelTitle);
}
const handleOnPopupModal=()=>
{
  gameServices.onPopupModal(socketService.socket,(popup)=>
  { 
   setShowPopup(popup);
  });
}

return (
    <section className='bottom_waiting_room'>
    <div className='waiting_title'><h2>Tên phòng:{roomName}</h2></div>
    <div className='h2h_title'>Head-to-Head: {h2hTitle}</div>
    <div className='boxes'>
    <div className='left_border'style={{display:'inline-block',border:'5px solid #000',padding:'15px 10px 15px 25px'}}>
    <WaitingRoomUser user={firstPlayer}/>
    </div>
    <div style={{display:'inline-block',border:'5px solid #000',padding:'15px 10px 15px 25px'}}>
    <WaitingRoomUser user={secondPlayer}/>
   {(notReady===true)?(<span className='status_player'>Trạng thái:Chưa sẵn sàng</span>):(<span className='status_ready'>Trạng thái:Sẵn sàng</span>)}
    </div>
   </div>
   <div style={{top:'50%',left:'50%',textAlign:'center',marginBottom:'50px'}}>
  {( firstPlayer.display_name===JSON.parse(localStorage.getItem('current_user')).display_name)?
   <ChangeLevel level_title={levelTitle} setTitle={setLevelTitle} disable={false}/>:(<ChangeLevel level_title={levelTitle} setTitle={setLevelTitle} disable={true}/>)
   }

   </div>
   <div className='mt-5 text-center'>
      {(firstPlayer.display_name===JSON.parse(localStorage.getItem('current_user')).display_name)?(<Button style={{marginRight:100}} color="primary" disabled={notReady} onClick={handleShowPopup} className='btn-lg'>Bắt đầu</Button>):(<Button style={{marginRight:100}} color="primary" className='btn-lg'  onClick={toggleReady}>Sẵn sàng</Button>)}
 
      {(firstPlayer.display_name===JSON.parse(localStorage.getItem('current_user')).display_name)?(<Button color="primary" className='btn-lg' onClick={leaveRoom}>Thoát</Button>):(<Button color="primary"  disabled={!notReady} className='btn-lg' onClick={leaveRoom}>Thoát</Button>)}
    </div>

    {showPopup===true?(<div className='modal_popup'>
     <PopupModal setOpenModal={setShowPopup} openModal={showPopup} setInRoom={setIsInRoom} firstPlayer={firstPlayer} secondPlayer={secondPlayer}></PopupModal>
    </div>):null}
    </section>
  );
}
export default WaitingRoom;