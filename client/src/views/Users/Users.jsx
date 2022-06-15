import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import instance from 'helpers/BaseUrl';
import MainCard from 'ui-component/cards/MainCard';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import AddIcon from '@mui/icons-material/Add';
import { useNavigate } from 'react-router';
import { useSelector } from 'react-redux';
import { useEffect } from 'react';
import { Grid } from '@mui/material';
import Modal from '@mui/material/Modal';
import Button from '@mui/material/Button';
import { useState } from 'react';
import Avatar from '@mui/material/Avatar';
import Stack from '@mui/material/Stack';
import LongMenu from 'views/pages/authentication/MenuIcon/MenuIcon';
import Pagination from '@mui/material/Pagination';
import FilterAltIcon from '@mui/icons-material/FilterAlt';

export default function User() {
    //-----------------------------------> Hooks

    let navigate = useNavigate();

    const [users, setusers] = React.useState([]);
    const [allUsers, setallUsers] = useState([]);
    const [loading, setloading] = React.useState(true);
    const [open, setOpen] = useState(false);
    const [userId, setuserId] = useState('');
    const [totalPages, settotalPages] = useState(1);

    const messageStyle = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 300,
        height: 100,
        bgcolor: 'background.paper',
        boxShadow: 24,
        p: 4,
        textAlign: 'center',
        borderRadius: '2%'
    };

    //-------------------> get all users function start
    let getusers = async (page = 1, limit = 6) => {
        setloading(true);
        try {
            await instance({
                method: 'GET',
                url: `api/user?page=${page}&limit=${limit}`
            }).then((res) => {
                if (res.status == 200) {
                    console.log(res.data);
                    settotalPages(res.data.totalPages);
                    setusers(res.data?.users);
                    setallUsers(res.data.allUsers);
                    setloading(false);
                }
            });
        } catch (err) {
            console.log(err);
            setloading(false);
        }
    };

    useEffect(async () => {
        getusers();
    }, [navigate]);

    const { search } = useSelector((state) => state.customization);

    useEffect(async () => {
        if (search?.length) {
            // setloading(true);

            let filterData = allUsers.filter((x) => x.name.toLowerCase().includes(search.toLowerCase()));
            setusers(filterData);
        } else {
            getusers();
        }
    }, [search]);

    const addAdminClick = () => {
        navigate('/addUser');
    };

    // ---------------------------> to close modal
    const handleClose = () => {
        setOpen(false);
    };

    // --------------------------> Delete admin

    const handleDelete = async () => {
        setOpen(false);
        setloading(true);

        try {
            await instance({
                method: 'DELETE',
                url: `api/user/${userId}`
            }).then((res) => {
                if (res.status == 200) {
                    getusers();
                    setTimeout(() => {
                        setloading(false);
                    }, 1000);
                }
            });
        } catch (err) {
            console.log(err);
            setloading(false);
        }
    };

    //------------------------> Open Delete modal
    const deleteIconClick = (id) => {
        setOpen(true);
        setuserId(id);
    };

    // ----------------------------> Handle user update

    const handleUpdate = (id) => {
        navigate(`/user/${id}`);
    };

    //------------------->Pagination

    const [page, setPage] = React.useState(1);

    const handleChange = (event, value) => {
        getusers(value);
        setPage(value);
    };

    return (
        <>
            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                    <CircularProgress />
                </Box>
            ) : (
                <MainCard title="Users" style={{ position: 'relative' }}>
                    <h4 style={{ position: 'absolute', right: '5%', top: '2%' }}>{/* <FilterAltIcon /> */}</h4>
                    <TableContainer component={Paper} style={{ position: 'relative' }}>
                        <Table sx={{ minWidth: 650 }} aria-label="simple table">
                            <TableHead>
                                <TableRow>
                                    <TableCell align="left">Profile</TableCell>
                                    <TableCell align="center">Name</TableCell>
                                    <TableCell align="center">Email</TableCell>
                                    <TableCell align="center">Contact No</TableCell>
                                    <TableCell align="center">My referral Code</TableCell>
                                    <TableCell align="center">Membership</TableCell>
                                    <TableCell align="center">Membership Ends on</TableCell>
                                    <TableCell align="center">Date of Joining</TableCell>
                                    <TableCell align="center">
                                        <Tooltip title="Add" onClick={addAdminClick}>
                                            <IconButton>
                                                <AddIcon />
                                            </IconButton>
                                        </Tooltip>
                                    </TableCell>
                                    {/* {users.map((x) => {
                                    console.log(new Date(x.createdAt).toDateString());
                                })} */}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {users?.length > 0 ? (
                                    users.map((row) => (
                                        <TableRow key={row._id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                            <TableCell
                                                align="center"
                                                component="th"
                                                scope="row"
                                                style={{ borderBottom: '1px solid rgba(224, 224, 224, 1)' }}
                                            >
                                                <Stack direction="row" spacing={2}>
                                                    <Avatar alt="Cindy Baker" src={row.image} />
                                                </Stack>
                                            </TableCell>
                                            <TableCell align="center">{row.name}</TableCell>
                                            <TableCell align="center">{row.email}</TableCell>
                                            <TableCell align="center">{row.phone}</TableCell>
                                            <TableCell align="center">{row?.myReferral?.code}</TableCell>
                                            {console.log(row)}
                                            <TableCell align="center">{new Date(row?.premiumDate).toDateString()}</TableCell>
                                            <TableCell align="center">{row?.isPremium ? 'Active' : 'Not Active'}</TableCell>
                                            <TableCell align="center">{new Date(row.createdAt).toDateString()}</TableCell>
                                            <TableCell align="center">
                                                <LongMenu
                                                    handleDelete={() => deleteIconClick(row._id)}
                                                    handleUpdate={() => handleUpdate(row._id)}
                                                />
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow key={'1'} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                        <TableCell colSpan={8} align="center">
                                            No Data found
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <Grid justifyContent={'center'} container pt={2}>
                        <Pagination align="center" count={totalPages} page={page} onChange={handleChange} />
                    </Grid>
                </MainCard>
            )}

            {/* ////////////////////------------------> confirm delete modal  */}
            <Modal open={open} onClose={handleClose}>
                <Box sx={messageStyle}>
                    <Grid container spacing={3}>
                        <Grid item xs={6}>
                            <Button onClick={() => setOpen(false)}>Cancel</Button>{' '}
                        </Grid>
                        <Grid item xs={6}>
                            <Button onClick={handleDelete} type="" variant="contained" color="error">
                                Delete
                            </Button>
                        </Grid>
                    </Grid>
                </Box>
            </Modal>
        </>
    );
}
