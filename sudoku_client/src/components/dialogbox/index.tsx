import { title } from 'process';
import React from 'react';
import styled from 'styled-components';
import Swal from 'sweetalert2';

const AlertErrorDialog=(data,title)=>
{
  Swal.fire({
    icon:'error',
    title:title,
    text:data
  });
};

const AlertCheckDialog=(data,title)=>
{
   Swal.fire(
    {
    icon:'success',
    title:title,
    text:data
   });
};

const AlertQuestionDialog=(data,title)=>
{
Swal.fire({
   icon:'question',
   title:title,
   text:data
});
};
const AlertWarningDialog=(data,title)=>
{
Swal.fire({
   icon:'warning',
   title:title,
   text:data
});
};

export {AlertCheckDialog,AlertErrorDialog,AlertQuestionDialog,AlertWarningDialog};