import { UncontrolledDropdown,DropdownToggle,DropdownItem,DropdownMenu } from "reactstrap";
import gameServices from "../../services/gameServices";
import socketService from "../../services/socketService";
const ChangeLevel=({level_title,setTitle,disable})=>
{
const  changeValue=(e)=>
{
 setTitle(e.currentTarget.textContent);
 gameServices.updateLevel(socketService.socket,e.currentTarget.textContent);
}

return(
<UncontrolledDropdown>
  <DropdownToggle size='lg'
    caret
    color="dark"
  >
   {level_title}
  </DropdownToggle>
  <DropdownMenu dark >

    <DropdownItem onClick={changeValue} disabled={disable}>
      Easy
    </DropdownItem>
    <DropdownItem onClick={changeValue} disabled={disable}>
      Medium
    </DropdownItem>
    <DropdownItem onClick={changeValue} disabled={disable}>
     Hard
    </DropdownItem>
    <DropdownItem onClick={changeValue} disabled={disable}>
        Extreme
    </DropdownItem>
  </DropdownMenu>
</UncontrolledDropdown>
);
}
export default ChangeLevel;