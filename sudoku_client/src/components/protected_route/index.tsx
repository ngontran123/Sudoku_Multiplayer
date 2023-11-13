import { useEffect, useState } from "react";
import { Outlet,Navigate } from "react-router-dom";
import { authToken } from "../../services/apiService/api";

const ProtectedRoutes=()=>
{
if(localStorage.getItem('token'))
{
    return <Outlet/>;
}
return <Navigate to='/login'/>
}
export default ProtectedRoutes;
