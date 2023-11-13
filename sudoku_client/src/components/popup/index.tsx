import { count } from 'console';
import React, { useEffect, useState } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { SudokuPuzzle } from "../../sudokuPuzzle";

function PopupModal({setOpenModal,openModal,setInRoom,firstPlayer,secondPlayer}) {
    const[countdown,setCountdown]=useState(3);
    var sudokuPuzzle=()=>
    {
      var ar=new SudokuPuzzle(9,80);
      ar.fillValues();
      var ar1=ar.returnArray();
      return ar1;
    }
    useEffect(()=>{
     const countDownInterval=setInterval(()=>{
           if(countdown>1)
           {
            setCountdown(prev=>prev-1);
           }
           else
           {
                setOpenModal(false);
                setInRoom(true);
                localStorage.setItem("first_player",JSON.stringify(firstPlayer));
                localStorage.setItem("second_player",JSON.stringify(secondPlayer));
                clearInterval(countDownInterval);
           }
     },1000);
     return ()=>clearInterval(countDownInterval);
    },[countdown]);
  return (
    <div>
      <Modal isOpen={openModal}>
        <ModalHeader>Chuẩn bị bắt đầu</ModalHeader>
        <ModalBody>
          <p>Trận đấu sẽ bắt đầu trong <strong>{countdown}</strong> giây nữa.</p>
        </ModalBody>
      </Modal>
    </div>
  );
}

export default PopupModal;