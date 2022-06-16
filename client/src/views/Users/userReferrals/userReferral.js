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
import { useNavigate } from 'react-router';
import { useSelector } from 'react-redux';
import { useEffect } from 'react';
import { Grid, Typography } from '@mui/material';
import Modal from '@mui/material/Modal';
import Button from '@mui/material/Button';
import { useState } from 'react';
import Avatar from '@mui/material/Avatar';
import Stack from '@mui/material/Stack';
import Chip from '@mui/material/Chip';
import ShowMessage from 'helpers/Alert';
import Pagination from '@mui/material/Pagination';
import CloseIcon from '@mui/icons-material/Close';



export default function UserReferral() {
    //-----------------------------------> Hooks

    let navigate = useNavigate();

    const [referrals, setreferrals] = React.useState([]);
    const [loading, setloading] = React.useState(true);
    //to open list of referrals modal
    const [open, setOpen] = useState(false);
    //to viwe all referrals set clicked
    const [userRefs, setuserRefs] = useState(false);
    //to set message for popup
    const [message, setmessage] = useState('');
    // to show popup
    const [openMessage, setopenMessage] = useState(false);
    //To open confirm membership date increament
    const [openIncreamentModal, setopenIncreamentModal] = useState(false);
    //loading condition for show referrals
    const [refLoading, setrefLoading] = useState(false);
    //for pagination
    const [totalPages, settotalPages] = useState(1);

    const messageStyle = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        // width: 300,
        // height: 500,
        maxWidth: 500,
        bgcolor: 'background.paper',
        boxShadow: 24,
        p: 4,
        textAlign: 'center'
    };

    const getreferrals = async (page=1,limit=5) => {
        setloading(true);
        try {
            await instance({
                method: 'GET',
                url: `api/user/user/referral?page=${page}&limit=${limit}`
            }).then((res) => {
                if (res.status == 200) {
                    setreferrals(res.data?.referrals);
                    settotalPages(res.data.totalPages)
                    setTimeout(() => {
                        setloading(false);
                    }, 1000);
                }
            });
        } catch (err) {
            console.log(err);
            setloading(false);
            setopenMessage(true);
            setmessage('Something went wrong !');
        }
    };

    useEffect(async () => {
        getreferrals();
    }, [navigate]);

    ///Set timeout for popup message

    useEffect(() => {
        setTimeout(() => {
            setopenMessage(false);
        }, 3000);
    }, [openMessage]);

    const { search } = useSelector((state) => state.customization);

    //-------------------------> for search
    useEffect(async () => {
        setloading(true);
        if (search?.length > 0) {
            setloading(false);
            let filter = referrals;
            let result = referrals.filter((x) => x.user.name.toLowerCase().includes(search.toLowerCase()));
            setreferrals(result);
        } else {
            getreferrals();
        }
    }, [search]);

    // ---------------------------> to close modal
    const handleClose = () => {
        setOpen(false);
    };

    //-----------------------------------> get all user referrals

    //------------------------> Open Referrals modal
    const viewReferral = async (id) => {
        setOpen(true);
        setrefLoading(true);
        try {
            await instance({
                method: 'GET',
                url: `api/user/user/referral/${id}`
            }).then((res) => {
                if (res.status == 200) {
                    setuserRefs(res.data?.referrals);
                    setrefLoading(false);
                }
            });
        } catch (err) {
            console.log(err);
            setloading(false);
            setopenMessage(true);
            setmessage('Something went wrong !');
        }
    };

    // ----------------------------> Handle user Premium increament

    const increasePremium = async (id, userPreDate) => {
        let date = new Date(userPreDate);
        date.setDate(date.getDate() + 30);

        let today = new Date()

        try {
            await instance({
                method: 'PUT',
                url: `api/user/${id}`,
                data: { premiumDate: date, isPremium: today <= date ? true : false }
            }).then((res) => {
                if (res.status == 200) {
                    setmessage('Premium Membership increased +30Days !');
                    setopenMessage(true);
                    navigate(0);
                }
            });
        } catch (err) {
            console.log(err);
            setopenMessage(true);
            setmessage('Something went wrong !');
        }
    };

        // ----------------------------> Handle user Premium decrease


    const decreasePremium = async (id, userPreDate) => {
        let date = new Date(userPreDate);
        date.setDate(date.getDate() - 30);

        let today = new Date()


        try {
            await instance({
                method: 'PUT',
                url: `api/user/${id}`,
                data: { premiumDate: date, isPremium: today <= date ? true : false}
            }).then((res) => {
                if (res.status == 200) {
                    setmessage('Premium Membership decreased by -30Days !');
                    setopenMessage(true);
                    navigate(0);
                }
            });
        } catch (err) {
            console.log(err);
            setopenMessage(true);
            setmessage('Something went wrong !');
        }
    };

    
    //------------------->Pagination

    const [page, setPage] = React.useState(1);

    const handleChange = (event, value) => {
        getreferrals(value);
        setPage(value);
    };

    return (
        <MainCard title="User Referrals">
            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                    <CircularProgress />
                </Box>
            ) : (
                <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 650 }} aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell align="left">Profile</TableCell>
                                <TableCell align="center">User</TableCell>
                                <TableCell align="center">User Email</TableCell>
                                <TableCell align="center">Total Referrals</TableCell>
                                <TableCell align="center">Membership Ends on</TableCell>
                                <TableCell align="center">Membership</TableCell>
                                <TableCell align="center">User Referral</TableCell>
                                <TableCell align="center">Increase Primium</TableCell>
                                {/* {referrals.map((x) => {
                                    console.log(new Date(x.createdAt).toDateString());
                                })} */}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {referrals?.length > 0 ? (
                                referrals.map((row) => (
                                    <TableRow key={row._id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                        <TableCell
                                            align="center"
                                            component="th"
                                            scope="row"
                                            style={{ borderBottom: '1px solid rgba(224, 224, 224, 1)' }}
                                        >
                                            <Stack direction="row" spacing={2}>
                                                <Avatar alt="Cindy Baker" src={row?.user?.image} />
                                            </Stack>
                                        </TableCell>
                                        <TableCell align="center">{row?.user?.name}</TableCell>
                                        <TableCell align="center">{row?.user?.email}</TableCell>
                                        <TableCell align="center">{row?.referrals?.length}</TableCell>
                                        <TableCell align="center">{(new Date(row?.user?.premiumDate)).toDateString()}</TableCell>
                                        <TableCell align="center">{row?.user?.isPremium ? 'Active': 'Not Active' }</TableCell>
                                        <TableCell align="center">
                                            <Chip label="View Referrals" color="default" onClick={() => viewReferral(row._id)} />
                                        </TableCell>
                                        <TableCell align="center">
                                            <Button variant="" onClick={() => increasePremium(row?.user?._id, row?.user?.premiumDate)}>
                                                +30 Days
                                            </Button>
                                            <Button
                                                variant="text"
                                                color="error"
                                                onClick={() => decreasePremium(row?.user?._id, row?.user?.premiumDate)}
                                            >
                                                -30 Days
                                            </Button>
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
            <Modal open={open} onClose={handleClose}>
                <Box sx={messageStyle}>
                <CloseIcon onClick={() => setOpen(false)} style={{ float: 'right', cursor:'pointer' }} />
                    <Typography variant="h4" mt={1} mb={3}>
                        User Name : {userRefs?.user?.name?.toUpperCase()}
                    </Typography>
                    <Typography align="left" variant="h4" mb={2}>
                        {userRefs?.referrals?.length ? 'My Referrals' : null}
                    </Typography>
                    {refLoading ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                            <CircularProgress />
                        </Box>
                    ) : (
                        <Grid container spacing={3}>
                            {userRefs?.referrals?.length ? (
                                userRefs?.referrals?.map((res) => {
                                    return (
                                        <>
                                            <Grid item xs={4}>
                                                <Stack direction="row" spacing={2}>
                                                    <Avatar alt="Cindy Baker" src={res.image} />
                                                    <Typography style={{ paddingTop: '7%' }}>{res.name}</Typography>
                                                </Stack>
                                            </Grid>
                                            <Grid item xs={4}>
                                                <Typography style={{ paddingTop: '7%' }}>{res.email}</Typography>
                                            </Grid>
                                            <Grid item xs={4}>
                                                <Typography style={{ paddingTop: '7%' }}> {userRefs.code}</Typography>{' '}
                                            </Grid>
                                        </>
                                    );
                                })
                            ) : (
                                <Grid item xs={12}>
                                    <Typography variant="h4">No Referrals</Typography>
                                </Grid>
                            )}
                            <Grid item xs={12}>
                                <Button variant="contained" onClick={() => setOpen(false)}>
                                    Cancel
                                </Button>{' '}
                            </Grid>
                        </Grid>
                    )}
                </Box>
            </Modal>
            <Grid justifyContent={'center'} container pt={2}>
                    <Pagination align="center" count={totalPages} page={page} onChange={handleChange} />
            </Grid>

            {/* -----------------------> Modal to confirm premium increament */}

            {/* <Modal open={open} onClose={handleClose}>
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
            </Modal> */}

            {/* -----------------------------> Popup */}

            <ShowMessage message={message} open={openMessage} />
        </MainCard>
    );
}
