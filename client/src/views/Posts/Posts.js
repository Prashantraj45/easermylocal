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
import { Grid, Modal, Button, Typography } from '@mui/material';
import { useState } from 'react';
import VisibilityIcon from '@mui/icons-material/Visibility';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import NativeSelect from '@mui/material/NativeSelect';
import ShowMessage from 'helpers/Alert';
import { useEffect } from 'react';
export default function Posts() {
    //------------------------------->Hooks

    let navigate = useNavigate();

    const [allPosts, setallPosts] = React.useState([]);
    const [loading, setloading] = React.useState(true);
    const [totalPages, settotalPages] = useState(1);
    //------------------> For modal
    const [open, setOpen] = useState(false);
    const [postDetail, setpostDetail] = useState({});
    const [messageOpen, setmessageOpen] = useState(false);
    const [openDelete, setopenDelete] = useState(false)
    const [postId, setpostId] = useState('')
    const [message, setmessage] = useState('')


    
    ///Set timeout for popup message

    useEffect(() => {
        setTimeout(() => {
            setmessageOpen(false);
        }, 3000);
    }, [messageOpen]);


    //get all partner function
    const allPostsFunc = async (page = 1, limit = 2) => {
        try {
            await instance({
                method: 'GET',
                url: `api/post?page=${page}&limit=${limit}`
            }).then((res) => {
                if (res.status == 200) {
                    setallPosts(res.data.posts);
                    settotalPages(res.data.totalPages);
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
        allPostsFunc();
    }, [navigate]);

    const { search } = useSelector((state) => state.customization);

    React.useEffect(async () => {
        if (search?.length > 0) {
            try {
                await instance({
                    method: 'GET',
                    url: `api/post`
                }).then((res) => {
                    if (res.status == 200) {
                        setloading(false);
                        let filterPartner = res?.data?.posts?.filter((x) =>
                            x?.serviceCategory?.name?.toLowerCase().includes(search.toLowerCase())
                        );
                        setallPosts(filterPartner);
                    }
                });
            } catch (err) {
                console.log(err);
                setloading(false);
            }
        } else {
            allPostsFunc();
        }
    }, [search]);

    const addPost = () => {
        navigate('/addpost');
    };

    const handleUpdate = async (id) => {
        navigate(`update/${id}`);
    };

    const handleDelete = async (id) => {
        setopenDelete(true)
        await instance({
            method: 'DELETE',
            url: `api/post/${postId}`
        }).then((res) => {
            console.log(res);
            if (res.status == 200) {
                allPostsFunc();
                setopenDelete(false)
                setmessage("Post Deleted !")
                setmessageOpen(true)
            }
        });
    };

    //------------------->Pagination

    const [page, setPage] = React.useState(1);

    const handleChange = (event, value) => {
        allPostsFunc(value);
        setPage(value);
    };

    const handleStatusChange = async (e, id) => {
        console.log(e.target.name, e.target.value);
        await instance({
            method: 'Put',
            url: `api/post/${id}`,
            data: { [e.target.name]: e.target.value }
        }).then((res) => {
            // alert("Status updated !")
            setmessage('Status updated! ')
            setmessageOpen(true);
        });
    };

    //--------------------> Modal
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
        textAlign: 'left',
        letterSpacing: 1
    };

    const handleClose = () => {
        setOpen(false);
        setopenDelete(false)
    };

    const openModal = (name, des, tags, comments) => {
        setOpen(true);
        setpostDetail({
            name,
            des,
            tags,
            comments
        });
    };

    return (
        <MainCard title="Posts">
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
                                <TableCell align="center">Description</TableCell>
                                <TableCell align="center">Tags</TableCell>
                                <TableCell align="center">Comments</TableCell>
                                <TableCell align="center">Status</TableCell>
                                <TableCell align="center">View</TableCell>
                                <TableCell align="center">
                                    <Tooltip title="Add" onClick={addPost}>
                                        <IconButton>
                                            <AddIcon />
                                        </IconButton>
                                    </Tooltip>
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {allPosts?.length > 0 ? (
                                allPosts.map((row) => (
                                    <TableRow key={row._id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                        {/* <TableCell align="center" component="th" scope="row" style={{ display: 'inline-flex' }}>
                                            <Stack direction="row" spacing={2}>
                                                <Avatar alt="Cindy Baker" src={row.image} />
                                            </Stack>
                                        </TableCell> */}
                                        <TableCell align="center">{row?.serviceCategory?.name}</TableCell>
                                        <TableCell align="center">{row?.description?.slice(0, 20)}...</TableCell>
                                        <TableCell align="center">
                                            {row?.tags?.map((x) => {
                                                return x + ', ';
                                            })}
                                            {row?.tags?.length === 0 && 'No Tags'}
                                        </TableCell>
                                        <TableCell align="center">
                                            {row?.comments?.map((x) => {
                                                return x + ', ';
                                            })}
                                            {row?.comments?.length === 0 && 'No Comments'}
                                        </TableCell>
                                        <TableCell align="center">
                                            <FormControl>
                                                <InputLabel variant="standard" htmlFor="uncontrolled-native"></InputLabel>
                                                <NativeSelect name="status" onChange={(e) => handleStatusChange(e, row._id)}>
                                                    <option selected disabled>
                                                        {row.status}
                                                    </option>
                                                    <option key={row._id + 1} value={'Active'}>
                                                        Active
                                                    </option>
                                                    <option key={row._id + 2} value={'Expired'}>
                                                        Expired
                                                    </option>
                                                    <option key={row._id + 3} value={'Closed'}>
                                                        Closed
                                                    </option>
                                                </NativeSelect>
                                            </FormControl>
                                        </TableCell>
                                        <TableCell align="center">
                                            <VisibilityIcon
                                                style={{ cursor: 'pointer' }}
                                                onClick={() =>
                                                    openModal(row?.serviceCategory?.name, row?.description, row?.tags, row.comments)
                                                }
                                            />
                                        </TableCell>
                                        {/* <TableCell align="center">{row.charges}</TableCell> */}
                                        {/* <TableCell align="center">{row.category.name}</TableCell>
                                          <TableCell align="center">{row.description}</TableCell>
                                          <TableCell align="center">{row.active ? 'Active' : 'Not Active'}</TableCell> */}
                                        <TableCell align="center">
                                            <LongMenu
                                                handleDelete={() => {setpostId(row._id);setopenDelete(true)}}
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

            {/* ---------------------------------------> Modal to view post full details */}

            <Modal open={open} onClose={handleClose}>
                <Box sx={messageStyle}>
                    <Grid item xs={12} mb={2}>
                        <Typography variant="h2">Post details</Typography>
                    </Grid>
                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <Typography variant="h5" display={'inline-block'}>
                                Name :{' '}
                            </Typography>
                            {' ' + postDetail?.name}
                        </Grid>
                        <Grid item xs={12}>
                            <Typography variant="h5" display={'inline-block'}>
                                Description :{' '}
                            </Typography>
                            {' ' + postDetail?.des}
                        </Grid>
                        <Grid item xs={12}>
                            <Typography variant="h5" display={'inline-block'}>
                                Tags :{' '}
                            </Typography>
                            {' ' + postDetail?.tags}
                            {postDetail?.tags?.length === 0 && 'No comments'}
                        </Grid>
                        <Grid item xs={12}>
                            <Typography variant="h5" display={'inline-block'}>
                                Comments :{' '}
                            </Typography>
                            {' ' + postDetail?.comments}
                            {postDetail?.comments?.length === 0 && 'No comments'}
                        </Grid>
                    </Grid>
                </Box>
            </Modal>

            
            {/* ////////////////////------------------> confirm delete modal  */}
            <Modal open={openDelete} onClose={handleClose}>
                <Box sx={messageStyle}>
                    <Grid container spacing={3}>
                        <Grid item xs={6}>
                            <Button onClick={() => setopenDelete(false)}>Cancel</Button>{' '}
                        </Grid>
                        <Grid item xs={6}>
                            <Button onClick={handleDelete} type="" variant="contained" color="error">
                                Delete
                            </Button>
                        </Grid>
                    </Grid>
                </Box>
            </Modal>

            {/* //--------------------------> Show message */}
            <ShowMessage message={message} open={messageOpen} />
        </MainCard>
    );
}
