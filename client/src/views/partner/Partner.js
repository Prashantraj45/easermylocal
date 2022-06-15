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
import Avatar from '@mui/material/Avatar';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import LongMenu from 'views/pages/authentication/MenuIcon/MenuIcon';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import AddIcon from '@mui/icons-material/Add';
import { useNavigate } from 'react-router';
import MainCard from 'ui-component/cards/MainCard';
import CircularProgress from '@mui/material/CircularProgress';
import { useSelector } from 'react-redux';
import Pagination from '@mui/material/Pagination';
import { Grid } from '@mui/material';
import {useState} from 'react'


export default function PartnerTable() {
    //------------------------------->Hooks

    let navigate = useNavigate();

    const [allPartners, setallPartners] = React.useState([]);
    const [loading, setloading] = React.useState(true);
    const [totalPages, settotalPages] = useState(1);

    //get all partner function
    const allPArtners = async (page=1,limit=5) => {
        try {
            await instance({
                method: 'GET',
                url: `api/partner?page=${page}&limit=${limit}`
            }).then((res) => {
                if (res.status == 200) {
                    console.log(res.data)
                    let verifiedPartner = res.data.partners.filter((x) => x.verified == true);
                    setallPartners(verifiedPartner);
                    settotalPages(res.data.totalPages)
                    setTimeout(() => {
                        setloading(false);
                    }, 1500);
                }
            });
        } catch (err) {
            console.log(err);
            setloading(false);
        }
    };

    React.useEffect(async () => {
        allPArtners();
    }, [navigate]);

    const { search } = useSelector((state) => state.customization);

    React.useEffect(async () => {
        try {
            await instance({
                method: 'GET',
                url: `api/partner`
            }).then((res) => {
                if (res.status == 200) {
                    setloading(false);
                    let verifiedPartner = res.data.partners.filter((x) => x.verified == true);
                    let filterPartner = verifiedPartner.filter(
                        (x) => x.verified == true && x.name.toLowerCase().includes(search.toLowerCase())
                    );
                    setallPartners(filterPartner);
                }
            });
        } catch (err) {
            console.log(err);
            setloading(false);
        }
    }, [search]);

    const addPartnerClick = () => {
        navigate('/addPartner');
    };

    const handleUpdate = async (id) => {
        navigate(`update/${id}`);
        console.log('update', id);
    };

    const handleDelete = async (id) => {
        await instance({
            method: 'DELETE',
            url: `api/partner/${id}`
        }).then((res) => {
            console.log(res);
            if (res.status == 200) {
                allPArtners();
            }
        });
    };

        //------------------->Pagination

        const [page, setPage] = React.useState(1);

        const handleChange = (event, value) => {
            allPArtners(value);
            setPage(value);
        };

    return (
        <MainCard title="Partners">
            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                    <CircularProgress />
                </Box>
            ) : (
                <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 650 }} aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell align="left">Image</TableCell>
                                <TableCell align="center">Name</TableCell>
                                <TableCell align="center">Email</TableCell>
                                {/* <TableCell align="center">Commission</TableCell> */}
                                <TableCell align="center">Phone</TableCell>
                                <TableCell align="center">Rating</TableCell>
                                <TableCell align="center">Service</TableCell>
                                <TableCell align="center">Charges</TableCell>
                                <TableCell align="center">
                                    <Tooltip title="Add" onClick={addPartnerClick}>
                                        <IconButton>
                                            <AddIcon />
                                        </IconButton>
                                    </Tooltip>
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {allPartners?.length > 0 ? (
                                allPartners.map((row) => (
                                    <TableRow key={row.name} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                        <TableCell align="center" component="th" scope="row" style={{ display: 'inline-flex' }}>
                                            <Stack direction="row" spacing={2}>
                                                <Avatar alt="Cindy Baker" src={row.image} />
                                            </Stack>
                                        </TableCell>
                                        <TableCell align="center">{row.name}</TableCell>
                                        <TableCell align="center">{row.email}</TableCell>
                                        {/* <TableCell align="center">{row.commission}%</TableCell> */}
                                        <TableCell align="center">{row.phone}</TableCell>
                                        <TableCell align="center">{row.rating}/5</TableCell>
                                        <TableCell align="center">{row.service?.map(x => {
                                            return x.name + ', '
                                        })}</TableCell>
                                        <TableCell align="center">{row.charges}</TableCell>
                                        {/* <TableCell align="center">{row.category.name}</TableCell>
                                          <TableCell align="center">{row.description}</TableCell>
                                          <TableCell align="center">{row.active ? 'Active' : 'Not Active'}</TableCell> */}
                                        <TableCell align="center">
                                            <LongMenu
                                                handleDelete={() => handleDelete(row._id)}
                                                handleUpdate={() => handleUpdate(row._id)}
                                            />
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow key={'1'} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                    <TableCell sx={{ p: '5' }} colSpan={8} align="center">
                                        No Data found
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}
            <Grid justifyContent={'center'} container pt={2}>
                    <Pagination align="center" count={totalPages} page={page} onChange={handleChange} />
            </Grid>
        </MainCard>
    );
}
