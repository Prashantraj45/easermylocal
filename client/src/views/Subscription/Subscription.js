import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import axios from 'axios';
import instance from 'helpers/BaseUrl';
import { isAuthenticated } from 'helpers/Authentication';
import Avatar from '@mui/material/Avatar';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import LongMenu from 'views/pages/authentication/MenuIcon/MenuIcon';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip'
import AddIcon from '@mui/icons-material/Add';
import {useNavigate} from 'react-router'
import MainCard from 'ui-component/cards/MainCard';
import CircularProgress from '@mui/material/CircularProgress';




export default function BasicTable() {


    //-----------------------------------> Hooks


    const [allSubscription, setallSubscription] = React.useState([])
    const [loading, setloading] = React.useState(true)

    const getAllSubscription = async () => {
      await instance({
        method:"GET",
        url:'api/subscription'
      // })
      // await axios({
      //   method:'GET',
      //   url:`${BaseUrl}api/subscription`,
    }).then(res => {
      if (res.status == 200) {
        setallSubscription(res.data.data.data)
        setloading(false)
      }
    })
    }

    ///Use Effect get all subscription
    React.useEffect(async () => {
      getAllSubscription()
    },[])



    //?UseNavigate
    const navigate = useNavigate()

    const addServiceClick = () => {
      navigate('/addService')
  }


  const handleUpdate = async (id,priceId) => {
    navigate(`update/${id}/${priceId}`)
    console.log('update',id)
  }

  const handleDelete = async (id) => {
    await instance({
      method:'DELETE',
      url:`api/admin/service/${id}`,
    // })
    // await axios({
    //   method:'DELETE',
    //   url:`${BaseUrl}api/admin/service/${id}`,
    //   headers:{
    //     Authorization:isAuthenticated().token
    //   }
    }).then(res => {
      console.log(res)
      if (res.status == 200) {
        getAllSubscription()
      }
    })

    console.log('delete',id)
  }




  return (
    <MainCard title='Subscription' >
            {
        loading
        ?
        <Box sx={{ display: 'flex', justifyContent:'center' }}>
      <CircularProgress />
    </Box>
      :
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell align="center">Description</TableCell>
            <TableCell align='center'>Type</TableCell>
            <TableCell align="center">Currency</TableCell>
            <TableCell align="center">

              
    <Tooltip title="Add" onClick={addServiceClick} >
      <IconButton>
        <AddIcon />
      </IconButton> 
    </Tooltip>

            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {allSubscription.map((row) => (
            <TableRow
              key={row.product.name}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell >
                {console.log(row)}
                {row.product.name}
              </TableCell>
              <TableCell align="center">{row.product.description}</TableCell>
              <TableCell align="center">{row.product.type}</TableCell>
              <TableCell align="center">{row.price.currency}</TableCell>
              {/* <TableCell align="center">{row.product.active ? 'Active' : 'Not Active'}</TableCell> */}
              <TableCell align='center'><LongMenu handleDelete={() => handleDelete(row && row?.product?.id)} handleUpdate={() => handleUpdate(row && row?.product?.id,row?.price?.id)} /></TableCell>
              
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
}
    </MainCard>
  );
}


