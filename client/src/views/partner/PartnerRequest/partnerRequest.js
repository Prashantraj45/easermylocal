import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import instance from 'helpers/BaseUrl';
import Avatar from '@mui/material/Avatar';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import { useNavigate } from 'react-router';
import MainCard from 'ui-component/cards/MainCard';
import CircularProgress from '@mui/material/CircularProgress';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import Typography from '@mui/material/Typography';
import { InputLabel, TextField, FormHelperText, MenuItem, Select, FormControl, FilledInput } from '@material-ui/core';
import { Grid } from '@mui/material';
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import Pagination from '@mui/material/Pagination';
import CloseIcon from '@mui/icons-material/Close';

export default function PartnerRequestsTable() {
    //------------------------------->Hooks

    let navigate = useNavigate();

    const [allPartners, setallPartners] = useState([]);
    const [loading, setloading] = useState(true);
    const [open, setOpen] = useState(false);
    const [openCheckDoc, setopenCheckDoc] = useState(false);
    const [Values, setValues] = useState({
        mail: '',
        subject: 'Reject Verification !',
        message: ''
    });
    const [selectedUser, setselectedUser] = useState({});
    const [checkDocLoader, setcheckDocLoader] = useState(true);
    const [totalPages, settotalPages] = useState(1);

    const handleClose = () => {
        setopenCheckDoc(false);
        setOpen(false);
    };

    const allPartnersFunc = async (page = 1, limit = 5) => {
        await instance({
            method: 'GET',
            url: `api/partner/requests?page=${page}&limit=${limit}`
        }).then((res) => {
            if (res.status == 200) {
                let filterPartner = res.data.partners.filter((x) => x.verified == false);
                setallPartners(filterPartner);
                settotalPages(res.data.totalPages);
                setTimeout(() => {
                    setloading(false);
                }, 1500);
            }
        });
    };

    React.useEffect(async () => {
        allPartnersFunc();
    }, [navigate]);

    const { search } = useSelector((state) => state.customization);

    useEffect(async () => {
        try {
            setloading(true);
            await instance({
                method: 'GET',
                url: `api/partner/requests`
            }).then((res) => {
                if (res.status == 200) {
                    setloading(false);
                    let verifiedPartner = res.data.partners.filter((x) => x.verified == false);
                    let filterPartner = verifiedPartner.filter(
                        (x) => x.verified == false && x.name.toLowerCase().includes(search.toLowerCase())
                    );
                    setallPartners(filterPartner);
                }
            });
        } catch (err) {
            console.log(err);
            setloading(false);
        }
    }, [search]);

    const approveClick = async (id) => {
        console.log(id);

        setopenCheckDoc(false);

        await instance({
            method: 'PUT',
            url: `api/partner/approve/${id}`,
            data: { verified: true }
        }).then((res) => {
            if (res.status == 200) {
                allPartnersFunc();
                // navigate('partner');
            }
            console.log(res);
        });
    };

    const rejectionClick = async (id, mail) => {
        setOpen(true);
        setopenCheckDoc(false);
        setValues({ ...Values, mail: mail, message: '' });
    };

    const sendRejctionMail = async () => {
        console.log(Values);
        await instance({
            method: 'POST',
            url: `api/admin/sendmail`,
            data: Values
        }).then((res) => {
            if (res.status == 200) {
                setOpen(false);
            }
        });
    };

    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 800,
        height: 500,
        bgcolor: 'background.paper',
        // border: '2px solid #000',
        boxShadow: 24,
        p: 4,
        textAlign: 'center'
    };

    const messageStyle = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 500,
        height: 300,
        bgcolor: 'background.paper',
        // border: '2px solid #000',
        boxShadow: 24,
        p: 4,
        textAlign: 'center'
    };

    let { message } = Values;

    const handleCheckDoc = async (id) => {
        setopenCheckDoc(true);
        // setselectedUser

        try {
            await instance({
                method: 'GET',
                url: `api/partner/${id}`
            }).then((res) => {
                if (res.status == 200) {
                    setselectedUser(res.data.partner);
                    setcheckDocLoader(false);
                }
            });
        } catch (err) {
            console.log(err);
        }
    };

    //------------------->Pagination

    const [page, setPage] = React.useState(1);

    const handleChange = (event, value) => {
        allPartnersFunc(value);
        setPage(value);
    };

    return (
        <MainCard title="Partner Requests">
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
                                <TableCell align="center">Charges per Hour</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {allPartners.length > 0 ? (
                                allPartners.map((row) => (
                                    <TableRow key={row.name} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                        <TableCell component="th" scope="row" style={{ display: 'inline-flex' }}>
                                            <Stack direction="row" spacing={2}>
                                                <Avatar alt="Cindy Baker" src={row.image} />
                                            </Stack>
                                        </TableCell>
                                        <TableCell align="center">{row.name}</TableCell>
                                        <TableCell align="center">{row.email}</TableCell>
                                        {/* <TableCell align="center">{row.commission}%</TableCell> */}
                                        <TableCell align="center">{row.phone}</TableCell>
                                        <TableCell align="center">{row.rating}/5</TableCell>
                                        <TableCell align="center">
                                            {row.service?.map((x) => {
                                                return x.name + ', ';
                                            })}
                                        </TableCell>
                                        <TableCell align="center">{row.charges} usd</TableCell>
                                        {/* <TableCell align="center">{row.category.name}</TableCell>
              <TableCell align="center">{row.description}</TableCell>
              <TableCell align="center">{row.active ? 'Active' : 'Not Active'}</TableCell> */}
                                        <TableCell align="center">
                                            <Button sx={{ mx: 2 }} onClick={() => handleCheckDoc(row._id)} type="" variant="contained">
                                                Check Doc
                                            </Button>
                                            {/* <Button onClick={() => approveClick(row._id)} type="" color="success" variant="contained">
                                                Approve
                                            </Button> */}
                                            {/* <Button
                                                sx={{ mx: 2 }}
                                                onClick={() => {
                                                    rejectionClick(row._id, row.email);
                                                }}
                                                type="submit"
                                                color="error"
                                                variant="contained"
                                            >
                                                Reject
                                            </Button> */}
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow key={'1'} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                    <TableCell colSpan={8} align="center">
                                        No Requests
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}

            {/* Modal for admin for review partner documents */}
            {/* Modal for admin to comment if rejection */}

            <Modal open={openCheckDoc} onClose={handleClose} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
                {/* <div className="modal-size"> */}
                <Box sx={style} width={'500px'} overflow="scroll">
                    <CloseIcon onClick={() => setopenCheckDoc(false)} style={{ float: 'right', cursor: 'pointer' }} />
                    {checkDocLoader ? (
                        <>
                            <h1>Loading...</h1>
                            <CircularProgress />
                        </>
                    ) : (
                        <Grid justifyContent={'center'} container spacing={5}>
                            <Grid item xs={12}>
                                <Typography color="#616161" variant="h1" ml={8} align="left">
                                    Documents
                                </Typography>
                            </Grid>
                            {
                                // selectedUser?.documents.companyNumber || selectedUser?.documents?.directorDocument
                                // ?
                                // <Grid item xs={12}>
                                // <Typography variant="h4" ml={8} mb={5} align="left">
                                //     Company Doc
                                // </Typography>
                                // {selectedUser?.documents?.companyNumber?.split('.').pop() === 'pdf' ? (
                                //     <iframe
                                //         src={`${selectedUser?.documents?.companyNumber}`}
                                //         width={600}
                                //         height={400}
                                //         style={{ marginBottom: '20px' }}
                                //     />
                                // ) : selectedUser?.documents?.companyNumber ? (
                                //     <img width={'350px'} height="350px" src={`${selectedUser?.documents?.companyNumber}`} />
                                // ) : (
                                //     'No Document !'
                                // )}
                                // <Typography variant="h4" ml={8} mb={5} align="left">
                                //     Company Doc
                                // </Typography>
                                // {selectedUser?.documents?.directorDocument?.split('.').pop() === 'pdf' ? (
                                //     <iframe
                                //         src={`${selectedUser?.documents?.directorDocument}`}
                                //         width={600}
                                //         height={400}
                                //         style={{ marginBottom: '20px' }}
                                //     />
                                // ) : selectedUser?.documents?.directorDocument ? (
                                //     <img width={'350px'} height="350px" src={`${selectedUser?.documents?.directorDocument}`} />
                                // ) : (
                                //     'No Document !'
                                // )}
                                // </Grid>
                                // :

                                <Grid item xs={12}>
                                    
                                    <Typography variant="h4" ml={8} mb={5} align="left">
                                        Company Number
                                    </Typography>
                                    <Typography variant="h4" ml={8} mb={5} align="left">
                                        {selectedUser?.documents?.companyNumber}
                                    </Typography>
                                    <Typography variant="h4" ml={8} mb={5} align="left">
                                        Passport
                                    </Typography>
                                    {/* {console.log(selectedUser?.documents?.drivingLicense?.split('.').pop())} */}
                                    {selectedUser?.documents?.passport?.split('.').pop() === 'pdf' ? (
                                        <iframe
                                            src={`${selectedUser?.documents?.passport}`}
                                            width={600}
                                            height={400}
                                            style={{ marginBottom: '20px' }}
                                        />
                                    ) : selectedUser?.documents?.passport ? (
                                        <img width={'350px'} height="350px" src={`${selectedUser?.documents?.passport}`} />
                                    ) : (
                                        'No Document !'
                                    )}

                                    <Typography variant="h4" ml={8} mb={5} align="left">
                                        Driving license
                                    </Typography>
                                    {selectedUser?.documents?.drivingLicense?.split('.').pop() === 'pdf' ? (
                                        <iframe
                                            src={`${selectedUser?.documents?.drivingLicense}`}
                                            width={600}
                                            height={400}
                                            style={{ marginBottom: '20px' }}
                                        />
                                    ) : selectedUser?.documents?.drivingLicense ? (
                                        <img width={'350px'} height="350px" src={`${selectedUser?.documents?.drivingLicense}`} />
                                    ) : (
                                        'No Document !'
                                    )}
                                    <Typography variant="h4" ml={8} mb={5} align="left">
                                        Biometric Residence permit
                                    </Typography>
                                    {selectedUser?.documents?.biometricResidencePermit?.split('.').pop() === 'pdf' ? (
                                        <iframe
                                            src={`${selectedUser?.documents?.biometricResidencePermit}`}
                                            width={600}
                                            height={400}
                                            style={{ marginBottom: '20px' }}
                                        />
                                    ) : selectedUser?.documents?.biometricResidencePermit ? (
                                        <img width={'350px'} height="350px" src={`${selectedUser?.documents?.biometricResidencePermit}`} />
                                    ) : (
                                        'No Document !'
                                    )}
                                    <Typography variant="h4" ml={8} mb={5} align="left">
                                        Citizen card
                                    </Typography>
                                    {selectedUser?.documents?.citizenCard?.split('.').pop() === 'pdf' ? (
                                        <iframe
                                            src={`${selectedUser?.documents?.citizenCard}`}
                                            width={600}
                                            height={400}
                                            style={{ marginBottom: '20px' }}
                                        />
                                    ) : selectedUser?.documents?.citizenCard ? (
                                        <img width={'350px'} height="350px" src={`${selectedUser?.documents?.citizenCard}`} />
                                    ) : (
                                        'No Document !'
                                    )}
                                    <Typography variant="h4" ml={8} mb={5} align="left">
                                        EU national identity card
                                    </Typography>
                                    {selectedUser?.documents?.nationalIdentityCard?.split('.').pop() === 'pdf' ? (
                                        <iframe
                                            src={`${selectedUser?.documents?.nationalIdentityCard}`}
                                            width={600}
                                            height={400}
                                            style={{ marginBottom: '20px' }}
                                        />
                                    ) : selectedUser?.documents?.nationalIdentityCard ? (
                                        <img width={'500px'} height="300px" src={`${selectedUser?.documents?.nationalIdentityCard}`} />
                                    ) : (
                                        'No Document !'
                                    )}
                                </Grid>
                            }
                            <Grid item xs={2}>
                                <Button
                                    style={{ color: 'white' }}
                                    onClick={() => approveClick(selectedUser._id)}
                                    type=""
                                    color="success"
                                    variant="contained"
                                >
                                    Approve
                                </Button>
                            </Grid>
                            <Grid item xs={2}>
                                <Button
                                    style={{ color: 'white' }}
                                    sx={{ mx: 2 }}
                                    onClick={() => {
                                        rejectionClick(selectedUser._id, selectedUser.email);
                                    }}
                                    type="submit"
                                    color="error"
                                    variant="contained"
                                >
                                    Reject
                                </Button>
                            </Grid>
                            <Grid item xs={2}>
                                <Button style={{ color: 'white' }} variant="contained" color="dark" onClick={() => setopenCheckDoc(false)}>
                                    Cancel
                                </Button>
                            </Grid>
                            <Grid item xs={12}>
                                {/* <Button onClick={() => setopenCheckDoc(false)}>Cancel</Button>{' '} */}
                                {/* <Button onClick={sendRejctionMail} type="" variant="contained">
                                Send
                            </Button> */}
                            </Grid>
                        </Grid>
                    )}
                </Box>
                {/* </div> */}
            </Modal>

            {/* Modal for admin to comment if rejection */}

            <Modal open={open} onClose={handleClose} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
                <Box sx={messageStyle} overflow="scroll">
                    <CloseIcon onClick={() => setOpen(false)} style={{ float: 'right', cursor: 'pointer' }} />
                    <Grid container spacing={5}>
                        <Grid item xs={12}>
                            <FormControl fullWidth>
                                <TextField
                                    fullWidth
                                    onChange={handleChange}
                                    required
                                    value={message}
                                    name="message"
                                    multiline={true}
                                    minRows={5}
                                    id="standard-basic"
                                    label="Message"
                                    variant="standard"
                                />
                            </FormControl>
                        </Grid>
                        <Grid item xs={12}>
                            <Button onClick={() => setOpen(false)}>Cancel</Button>{' '}
                            <Button onClick={sendRejctionMail} type="" variant="contained">
                                Send
                            </Button>
                        </Grid>
                    </Grid>
                </Box>
            </Modal>
            <Grid justifyContent={'center'} container pt={2}>
                <Pagination align="center" count={totalPages} page={page} onChange={handleChange} />
            </Grid>
        </MainCard>
    );
}
