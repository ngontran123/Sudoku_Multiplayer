import React from "react";
import styled from "styled-components";
import { useState, useContext } from 'react';
import {useEffect} from 'react';
import gameContext from "../../gameContext";
const TimerBoard=styled.div`
width:100%;
height:100%;
display:flex;
flex-direction:column;
align-items:center;
`
const TimerBox=styled.div`
width:250px;
height:100x;
border-radius:8px;
color:green;
cursor:default;
font-size:15px;
margin-left:15px;  
text-align:center;
`
function Timer({isGameStarted})
{ 
    const [time,setTime]=useState(0);
    var timeInterval=()=>{
        setTime((prev)=>prev+1000);
    }
    useEffect(()=>{
        let t=null;
        if(isGameStarted)
        {
        t=setInterval(timeInterval,1000);    
        }
        else
        {
            clearInterval(t);
            setTime(0);
        }
    return()=> {clearInterval(t);}

    },[isGameStarted,time]
  );
    return(
        <TimerBoard>
            <TimerBox>
            <span className="digits">{("0"+Math.floor((time/60000)%60)).slice(-2)}:</span>
            <span className="digits">{("0"+Math.floor((time/1000)%60)).slice(-2)}</span>
            </TimerBox>
        </TimerBoard>
    )
}
export default Timer