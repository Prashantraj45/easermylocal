import React, { useEffect } from 'react';
import Button from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar';

const ShowMessage = ({message,open}) => {

    const [state, setState] = React.useState({
        vertical: 'top',
        horizontal: 'center',
      });


      
    const { vertical, horizontal } = state;
    const handleClick = (newState) => () => {
        setState({ open: true, ...newState });
      };


      useEffect(() => {

        setTimeout(() => {
            setState({ ...state, open: false });
        },3000)

      },[open])

      return (
        <div>
        <Snackbar
            anchorOrigin={{ vertical, horizontal }}
            open={open}
            // onClose={handleClose}
            severity="warning"
            message={message}
            key={vertical + horizontal}
        />
    </div>
      )

}


export default ShowMessage;