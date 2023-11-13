import React from "react";
import styled from "styled-components";

const ButtonContainer=styled.div
`
width:100%;
height:100%;
display:flex;
flex-direction:row;
align-items:center;
justify-content:center;
padding:20px; 
`;
const ButtonClear=styled.button`
background-color:green;
border-radius:8px;
color:white;
font-size:20px;
width:120px;
height:35px;
margin-right:20px;
cursor:pointer;
transition:0.3s;
&:hover{
    transform:scale(1.1);
}
`;
const ButtonNewGame=styled.button`
background-color:red;
border-radius:8px;
color:white;
font-size:20px;
width:120px;
height:35px;
cursor:pointer;
transition:0.3s;
margin-right:20px;
&:hover
{
    transform:scale(1.1);
}
`;
const ButtonNote=styled.button`
background-color:aqua;
border-radius:8px;
color:white;
font-size:20px;
width:120px;
height:35px;
cursor:pointer;
transition:0.3s;
margin-right:20px;
&:hover
{
    transform:scale(1.1);
}
`;

const ButtonHint=styled.button`
border-radius:8px;
position:relative;
color:white;
font-size:20px;
width:120px;
height:35px;
cursor:pointer;
transition:0.3s;
margin-right:20px;
&:hover
{
    transform:scale(1.1);
}
`;
function Button({handlePress,isNote,hint_count})
{
    const handleClick=(name)=>
    {
        handlePress(name);
    }
return(
    <ButtonContainer>
        <ButtonClear onClick={()=>handleClick("Clear")}>
            Remove
        </ButtonClear>
        <ButtonNewGame onClick={()=>handleClick("New Game")}>
            Clear
        </ButtonNewGame>
        <ButtonNote onClick={()=>handleClick("Note")}>
            Notes:{isNote?'On':'Off'}
        </ButtonNote>
        <ButtonHint onClick={()=>handleClick("Hint")}>
            <img src="https://ik.imagekit.io/qlzt6djaz/light-bulb.png?updatedAt=1698228939409" className="bulb-image" alt="Bulb"/>
            <div className="number-badge">{hint_count}</div>
        </ButtonHint>
    </ButtonContainer>
);
}
export default Button;