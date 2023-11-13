import React from "react";
import styled from "styled-components";
import './index1.css';
const ButtonBoard=styled.div`
width:100%;
height:100%;
display:flex;
flex-direction:column;
align-items:center;
`;
const ChoiceContainer=styled.div`
display:flex;
justify-content:space-around;
flex:1;
margin-top:10px
`;
const Choice=styled.div
`
padding:5px 15px;
border:2px solid black;
border-radius:10px;
font-weight:800px;
cursor:pointer;
margin-left:5px;
`;
const TextColor=styled.div`
color:#000000;
`;
const button1=[1,2,3,4,5];
const button2=[6,7,8,9];
function ChangeButton({setClickValue,selected})
{
return(
    <ButtonBoard>
    <ChoiceContainer>
    { 
    button1.map((choice)=>{
        let isChecked=choice===selected?"selected-num":"";
        return(
            <Choice className={isChecked} onClick={()=>setClickValue(choice)}>
          <TextColor>{choice}</TextColor>
          </Choice>
        )
    })
    }
    </ChoiceContainer>
    <ChoiceContainer>
        {  
            button2.map((choice)=>{
                let isChecked=choice===selected?"selected-num":""
                return(
                    <Choice className={isChecked} onClick={()=>setClickValue(choice)}>
                    <TextColor>{choice}</TextColor>
                </Choice>
                )
            })
           
        }
        </ChoiceContainer>
    </ButtonBoard>
)
}
export default ChangeButton;