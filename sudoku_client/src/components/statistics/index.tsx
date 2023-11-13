import { Button, Card, CardBody, CardFooter, Col, Container, Row, Table } from 'reactstrap';
import { joiningRoom } from '../../services/apiService/api';
import { useState,useEffect,useContext} from 'react';
import gameServices from '../../services/gameServices';
import socketService from '../../services/socketService';
import gameContext from '../../gameContext';
const Statistics=({user})=>
{  
    var token=localStorage.getItem('token');
   const[easyWin,setEasyWin]=useState(0);
   const[easyLose,setEasyLose]=useState(0);
   const[mediumWin,setMediumWin]=useState(0);
   const[mediumLose,setMediumLose]=useState(0);
   const[hardWin,setHardWin]=useState(0);
   const[hardLose,setHardLose]=useState(0);
   const[extremeWin,setExtremeWin]=useState(0);
   const[extremeLose,setExtremeLose]=useState(0);
   const {isInRoom,setIsInRoom}=useContext(gameContext);

   const delay=ms=>new Promise(rs=>setTimeout(rs,ms));

   const prevPage=async()=>
 {
    var token_object={token:token};
    await joiningRoom(token_object);
 } 
 useEffect(()=>{
       var easy_win=parseInt(localStorage.getItem('easy_win'));
       var easy_lose=parseInt(localStorage.getItem('easy_lose'));
       var medium_win=parseInt(localStorage.getItem('medium_win'));
       var medium_lose=parseInt(localStorage.getItem('medium_lose'));

       var hard_win=parseInt(localStorage.getItem('hard_win'));

       var hard_lose=parseInt(localStorage.getItem('hard_lose'));

       var extreme_win=parseInt(localStorage.getItem('extreme_win'));
       

       var extreme_lose=parseInt(localStorage.getItem('extreme_lose'));

       setEasyWin(easy_win);
       setEasyLose(easy_lose);   
       setMediumWin(medium_win);
       setMediumLose(medium_lose);
       setHardWin(hard_win);
       setHardLose(hard_lose);
       setExtremeWin(extreme_win);
       setExtremeLose(extreme_lose);
 },[]);

return(
<Row>
<Col md={{size:200,offset:1}}>
<Card className='mt-3 border-0 rounded-0 shadow-sm' style={{width:600}}>
    <CardBody>
        <h3 style={{textAlign:'center'}}>Thống kê thành tích Multiplayer</h3>
        <Table responsive striped hover bordered={true} className='text-center mt-5'>
        <thead>
            <tr>
                <th>Độ khó</th>
                <th>Thắng</th>
                <th>Thua</th>
            </tr>
        </thead>
        <tbody>
        <tr>
            <td>Easy</td>
            <td>{easyWin}</td>
            <td>{easyLose}</td>
        </tr>
       
        <tr>
            <td>Medium</td>
            <td>{mediumWin}</td>
            <td>{mediumLose}</td>
        </tr> 
        
        <tr>
            <td>Hard</td>
            
            <td>{hardWin}</td>
            
            <td>{hardLose}</td>
        </tr>
        <tr>
            <td>Extreme</td>
            
            <td>{extremeWin}</td>
            
            <td>{extremeLose}</td>
        </tr>
        </tbody>    
        </Table>
    </CardBody>
    <CardFooter className='text-center'>
         <Button color="primary" onClick={prevPage}>Quay lại</Button>
    </CardFooter>
</Card>
</Col>
</Row>);
};
export default Statistics;