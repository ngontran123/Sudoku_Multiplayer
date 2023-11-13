import { Button, Card, CardBody, CardFooter, Col, Container, Row, Table } from 'reactstrap';
import { getUserDetail, joiningRoom } from '../../services/apiService/api';
import {useEffect} from 'react';
import { userInfo } from '../../services/apiService/api';
const UserProfile=({user})=>
{ var token=localStorage.getItem('token');
  var username=JSON.parse(localStorage.getItem('current_user')).username;

    const prevPage=async()=>
 {
    var token_object={token:token};
    await joiningRoom(token_object);
 } 
 
 const userDetailPage=async()=>
 { 
   await getUserDetail(token,username);
 }  

    return(
    <Row>
       <Col md={{size:200,offset:1}}>
        <Card className='mt-3 border-0 rounded-0 shadow-sm' style={{width:600}}>
        <CardBody>
            <h3 className='text-uppercase'>Thông tin user</h3>
            <Container className='text-center mt-1' >
                <img style={{ maxWidth: '200px', maxHeight: '200px' }} src={user.avatar} alt="user profile picture" className='img-fluid rounded-circle' />
            </Container>
            <Table responsive striped hover bordered={true} className='text-center mt-5'>
                <tbody>                   
                    <tr>
                        <td>
                            USER NAME
                        </td>
                        <td>
                            {user.display_name}
                        </td>
                    </tr>
                    <tr>
                        <td >
                            USER EMAIL
                        </td>
                        <td>
                            {user.email}
                        </td>
                    </tr>
                    <tr>
                        <td >
                            Giới tính
                        </td>
                        <td>
                            {user.gender}
                        </td>
                    </tr>
                    <tr>
                        <td>
                            Motto
                        </td>
                        <td>
                            {user.motto}
                        </td>
                    </tr>
                    <tr>
                        <td>
                            Ngày tạo
                        </td>
                        <td>
                            {user.created_date}
                        </td>
                    </tr>
                </tbody>
            </Table>
            <CardFooter className='text-center'>
            <Button color="primary" style={{marginRight:30}} onClick={userDetailPage}>Cập nhật Profile</Button>
            <Button color="primary" onClick={prevPage}>Quay lại</Button>
            </CardFooter>
        </CardBody>
    </Card>
    </Col>
    </Row>
     );
}
export default UserProfile;