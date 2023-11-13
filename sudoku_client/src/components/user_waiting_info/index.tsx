import React from 'react';
import { Card, CardBody, CardTitle, CardText, CardImg } from 'reactstrap';

const WaitingRoomUser=({user})=>
{
     return(

        <table cellSpacing={0} cellPadding={0} border={0}>
        <tbody>
            <tr>
                <td className='text-center'>
                 <img style={{width:150,height:150,border:'2px solid #fff'}} src={user.avatar} alt='Avatar Image'/>
                </td>
                <td style={{paddingLeft:20,fontSize:20,fontWeight:500,color:'#fff'}}>
                <span>Username:{user.display_name}</span>
             <br/>
             <br/>
             <span style={{fontSize:20,fontWeight:500,color:'#fff'}}>Motto:{user.motto}</span>
            </td>
            </tr>
        </tbody>
        </table>
      
     );
}
export default WaitingRoomUser;