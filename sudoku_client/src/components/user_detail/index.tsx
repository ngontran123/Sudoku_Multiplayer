import { Button, Card, CardBody,Col, Container, Row,Form,FormGroup, Label,Input} from 'reactstrap';
import { FormControlLabel,Checkbox} from "@material-ui/core";
import { useRef, useState ,useEffect} from 'react';
import { AlertCheckDialog, AlertErrorDialog, AlertWarningDialog } from "../dialogbox";
import { getTokenImageServer, getUserDetail, uploadImageToServer, userDetail, userInfo } from '../../services/apiService/api';
import { Avatar } from 'antd';
const UserDetail=({user})=>
{
    const [checkBoxList,setCheckBoxList]=useState(['Male','Female','Others']);
    var current_user=JSON.parse(localStorage.getItem('current_user'));
    const prevPage=async()=>
    {
       var username=JSON.parse(localStorage.getItem('current_user')).username;
       var token=localStorage.getItem('token');
       await userInfo(token,username);
    } 
    var login_user=
    {
      username:current_user.username,
      password:current_user.password,
      gender:current_user.gender,
      email:current_user.email,
      avatar:current_user.avatar,
      created_date:current_user.created_data,
      display_name:current_user.display_name,
      motto:current_user.motto
    };
    const refUrl=useRef(null);
    const [isChecked,setIsChecked]=useState(login_user.gender);
    const[currentUser,setCurrentUser]=useState(login_user);
    const[image,setImage]=useState(user.avatar);
    const[isUpdate,setIsUpdate]=useState(0);
    var onChange=(e)=>{
        if(e.target.checked)
        {
            if(!isChecked)
            {
                setIsChecked(e.target.value);
            }
            else{
                setIsChecked(null);
                setIsChecked((state)=>{return e.target.value});
            }
            onChangeForm(e);
        }
    }
    var onChangeForm=(e)=>
    {
        setCurrentUser({...currentUser,[e.target.name]:e.target.value});        
    }
    
    const checkGender=()=>{
        return checkBoxList.map((box)=>{
            return(
            <FormControlLabel
            control={<Checkbox checked={isChecked?isChecked===box:false} name='gender' value={box} onChange={onChange}/>} label={box}
            />
        )});
    }
    const onImageChange=(e)=>
    { 
 var preview = document.querySelector('img');
  var file    = e.target.files[0];
  var reader  = new FileReader();
  reader.onloadend = function () {
   if(typeof preview.src==='string')
   {
    preview.src = reader.result as string;
   }
  }
     if(e.target.files && file)
     {  reader.readAsDataURL(file);
       setImage(e.target.files[0]);
     }
     else
     {
        preview.src = "";
     }
    }
    var updateImage=async()=>
    { 
     var res_val='';
     var type_image=image['type'];
     var content_types=['image/png','image/jpeg'];
     if(!content_types.includes(type_image))
     {
        AlertWarningDialog('File đã chọn không phải hình ảnh',"Cập nhật avatar");
        return;
     }
     var username=JSON.parse(localStorage.getItem('current_user')).username;
     var token=localStorage.getItem('token');
     const payload=
     {
      token:localStorage.getItem('token')
     };
     var token_image=await getTokenImageServer(payload,token,username);
     var signature=token_image[2];
     var token_response=token_image[0];
     var expire=token_image[1];
     const data=
     {
      file:image,
      publicKey:'public_Rrp+V/wyvF9ubGkc33PTpEIavtw=',
      signature:signature,
      token:token_response,
      expire:expire,
      fileName:image.name,
      useUniqueFileName:false
     };
    await uploadImageToServer(data).then(async(res)=>{
    var url_image=res[0];
    var status_url=res[1];
  
    if(status_url===200)
    { 
        res_val=url_image;
    }
   else
   {
       AlertErrorDialog("Upload ảnh thất bại","Upload ảnh");
   }
    });
    return res_val;
}   
 
    const updateData=async()=>
    {   
        
        var res_val=await updateImage();
        var url_image=res_val;
        setCurrentUser(prevState=>({...prevState,avatar:url_image}));
        setIsUpdate(prevState=>prevState+1);
    };
     useEffect(()=>{
       if(isUpdate!==0)
       {
        var token=localStorage.getItem('token');
        var username=JSON.parse(localStorage.getItem('current_user')).username;
        userDetail(token,username,currentUser);
       }
     },[currentUser]);
return(
    <Row>
    <Col md={{size:200,offset:1}}>
     <Card className='mt-3 border-0 rounded-0 shadow-sm' style={{width:600}}>
     <CardBody>
         <h3 className='text-uppercase'>Sửa thông tin người dùng</h3>
         <Container className='text-center mt-1'>
                 <img style={{ maxWidth: '200px', maxHeight: '200px'}} src={image} alt="user profile picture" className='img-fluid rounded-circle' />
         </Container>
         <div className='mt-3 text-center'>
         <Input className='text-light'type="file" id="avatar" name="avatar" accept="image/png, image/jpeg" onChange={onImageChange}/>
        </div> 
    <Form>
       <FormGroup>
        <Label for="display_name">
            Username:
        </Label>
        <Input type="text" name="display_name" className='bg-dark text-light' onChange={onChangeForm} defaultValue={user.display_name}></Input>
       </FormGroup>
       <FormGroup>
        <Label for="motto">
            Motto:
        </Label>
        <Input type="text" name="motto" className='bg-dark text-light' onChange={onChangeForm} defaultValue={user.motto}></Input>
       </FormGroup>    
    </Form>
        <FormGroup>
            <Label for="gender">
                Giới tính:
            </Label>
        <span className="regisbox">
        {checkGender()}
        </span>
        </FormGroup>
        <div className='mt-5 text-center'>
            <Button color="primary" style={{marginRight:100}} onClick={updateData}>Xác nhận</Button>
            <Button color="primary" onClick={prevPage}>Quay lại</Button>
        </div>
 </CardBody>
 </Card>
 </Col>
 </Row>
);
}
export default UserDetail;