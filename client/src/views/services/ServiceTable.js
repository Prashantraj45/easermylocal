import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import axios from 'axios';
import instance, { BaseUrl } from 'helpers/BaseUrl';
import { isAuthenticated } from 'helpers/Authentication';
import Avatar from '@mui/material/Avatar';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import LongMenu from 'views/pages/authentication/MenuIcon/MenuIcon';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import AddIcon from '@mui/icons-material/Add';
import { useNavigate } from 'react-router';

import CircularProgress from '@mui/material/CircularProgress';

export default function BasicTable() {
    //-----------------------------------> Hooks

    const [services, setservices] = React.useState([]);
    const [loading, setloading] = React.useState(true);

    const getServices = async () => {
        await instance({
            method: 'GET',
            url: `api/admin/service`
        }).then((res) => {
            setloading(false);
            console.log(res);
            setservices(res.data.services);
        });
    };

    React.useEffect(async () => {
        getServices();
    }, []);

    //?UseNavigate
    const navigate = useNavigate();

    const addServiceClick = () => {
        navigate('/addService');
    };

    const handleUpdate = async (id) => {
        navigate(`update/${id}`);
        console.log('update', id);
    };

    const handleDelete = async (id) => {
        setloading(true);
        await instance({
            method: 'DELETE',
            url: `api/admin/service/${id}`
        }).then((res) => {
            console.log(res);
            if (res.status == 200) {
                setloading(false);
                getServices();
            }
        });

        console.log('delete', id);
    };

    return loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <CircularProgress />
        </Box>
    ) : (
        <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                    <TableRow>
                        <TableCell>Image</TableCell>
                        <TableCell>Name</TableCell>
                        <TableCell align="center">Partner</TableCell>
                        <TableCell align="center">Category</TableCell>
                        <TableCell align="center">Description</TableCell>
                        <TableCell align="center">status</TableCell>
                        <TableCell align="center">
                            <Tooltip title="Add" onClick={addServiceClick}>
                                <IconButton>
                                    <AddIcon />
                                </IconButton>
                            </Tooltip>
                        </TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {console.log(services)}
                    {services &&
                        services.map((row) => (
                            <TableRow key={row.name} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                <TableCell component="th" scope="row" style={{ display: 'inline-flex' }}>
                                    <Stack direction="row" spacing={2}>
                                        <Avatar alt="Cindy Baker" src={row.image} />
                                        {/* <Box sx={{p:1.5}}>{row.name}</Box> */}
                                    </Stack>
                                </TableCell>
                                <TableCell>{row.name}</TableCell>
                                <TableCell align="center">{row.partner?.name}</TableCell>
                                <TableCell align="center">{row.category?.map(x => {
                                    return row.category?.length > 1 ? x.name + ' ,' : x.name
                                })}</TableCell>
                                <TableCell align="center">{row.description}</TableCell>
                                <TableCell align="center">{row.active ? 'Active' : 'Not Active'}</TableCell>
                                <TableCell align="center">
                                    <LongMenu
                                        handleDelete={() => handleDelete(row && row?._id)}
                                        handleUpdate={() => handleUpdate(row && row?._id)}
                                    />
                                </TableCell>
                            </TableRow>
                        ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}
