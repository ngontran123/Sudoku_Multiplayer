import React from 'react';
function TokenExpired() {
  	return (
    	<div>
      		<h1><strong>401 Token Expired</strong></h1>
    	</div>
  	);
    }

function PageNotFound()
{
    return(
      <div>
        <h1 style={{color:"#cc11f0"}}><strong>404 Page Not Found</strong></h1>
      </div>
    );
}
export {TokenExpired,PageNotFound};