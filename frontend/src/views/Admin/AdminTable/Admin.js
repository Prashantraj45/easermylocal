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
import DeleteIcon from '@mui/icons-material/Delete';
import { Grid } from '@mui/material';
import Modal from '@mui/material/Modal';
import Button from '@mui/material/Button';
import { useState } from 'react';
import Pagination from '@mui/material/Pagination';

export default function Admin() {
    //-----------------------------------> Hooks

    let navigate = useNavigate();

    const [admins, setadmins] = React.useState([]);
    const [allAdmins, setallAdmins] = React.useState([]);
    const [loading, setloading] = React.useState(true);
    const [open, setOpen] = useState(false);
    const [adminId, setadminId] = useState('');
    const [totalPages, settotalPages] = useState(1)

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
        textAlign: 'center'
    };

    const getAdmins = async (page=1,limit = 6) => {
        try {
            setloading(true)
            await instance({
                method: 'GET',
                url: `api/admin?limit=${limit}&page=${page}`
            }).then((res) => {
                if (res.status == 200) {
                    setallAdmins(res.data.allAdmin)
                    setadmins(res.data?.admins);
                    settotalPages(res.data.totalPages)
                    setloading(false)
                }
            });
        } catch (err) {
            console.log(err);
            setloading(false);
        }
    };

    useEffect(async () => {
        getAdmins();
    }, [navigate]);

    const { search } = useSelector((state) => state.customization);

    useEffect(async () => {
        if (search?.length > 0) {
            try {
                await instance({
                    method: 'GET',
                    url: `api/admin`
                }).then((res) => {
                    if (res.status == 200) {
                        setloading(false);
                        let filterData = res.data?.admins.filter((x) => x.name.toLowerCase().includes(search.toLowerCase()));
                        setadmins(filterData);
                    }
                });
            } catch (err) {
                console.log(err);
                setloading(false);
            }
        } else {
            getAdmins();
        }
    }, [search]);

    const addAdminClick = () => {
        navigate('/addAdmin');
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
                url: `api/admin/${adminId}`
            }).then((res) => {
                if (res.status == 200) {
                    getAdmins();
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

    const deleteIconClick = (id) => {
        setOpen(true);
        setadminId(id);
    };

    
    //------------------->Pagination

    const [page, setPage] = React.useState(1);

    const handleChange = (event, value) => {
        getAdmins(value)
        setPage(value);
    };

    return (
        <MainCard title="Admins">
            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                    <CircularProgress />
                </Box>
            ) : (
                <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 650 }} aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell align="center">Name</TableCell>
                                <TableCell align="center">Email</TableCell>
                                <TableCell align="center">User Type</TableCell>
                                <TableCell align="center">
                                    <Tooltip title="Add" onClick={addAdminClick}>
                                        <IconButton>
                                            <AddIcon />
                                        </IconButton>
                                    </Tooltip>
                                </TableCell>
                                {console.log(admins)}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {admins?.length > 0 ? (
                                admins.map((row) => (
                                    <TableRow key={row._id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                        <TableCell align="center">{row.name}</TableCell>
                                        <TableCell align="center">{row.email}</TableCell>
                                        <TableCell align="center">{row.userType}</TableCell>
                                        <TableCell align="center">
                                            <DeleteIcon style={{ cursor: 'pointer' }} onClick={() => deleteIconClick(row._id)} />
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow key={'1'} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                    <TableCell colSpan={4} align="center">
                                        No Data found
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}

            {/* ////////////////////------------------> confirm delete modal  */}
            <Modal open={open} onClose={handleClose} >
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
            </Modal><Grid justifyContent={"center"} container pt={2} >                    
                <Pagination align="center" count={totalPages} page={page} onChange={handleChange} />
            </Grid>
        </MainCard>
    );
}
