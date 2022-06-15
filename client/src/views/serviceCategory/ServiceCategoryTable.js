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
import LongMenu from 'views/pages/authentication/MenuIcon/MenuIcon';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import AddIcon from '@mui/icons-material/Add';
import { useNavigate } from 'react-router';
import { useState } from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import { useSelector } from 'react-redux';
import Pagination from '@mui/material/Pagination';
import { Grid } from '@mui/material';


export default function BasicTable() {
    //-----------------------------------> Hooks

    const [servicesCat, setservicesCat] = React.useState([]);
    const [loading, setloading] = useState(true);
    const [totalPages, settotalPages] = useState(1);

    const getServices = async (page=1,limit=5) => {
        try {
            await instance({
                method: 'GET',
                url: `api/admin/service/category?page=${page}&limit=${limit}`
            }).then((res) => {
                if (res.status == 200) {
                    setservicesCat(res.data?.data);
                    console.log(res.data)
                    settotalPages(res.data.paginate.totalPage)
                    setTimeout(() => {
                        setloading(false);
                    }, 1500);
                }
            });
        } catch (err) {
            setloading(false);
            console.log(err);
        }
    };

    React.useEffect(async () => {
        getServices();
    }, [0]);

    
    const {search} = useSelector(state => state.customization)


    React.useEffect(async () => {

        if (search.length) {
            try{
                await instance({
                    method: 'GET',
                    url: `api/admin/service/category`
                }).then((res) => {
                    if (res.status == 200) {
                        let filterData = res.data?.message?.data.filter(x => x.name.toLowerCase().includes(search.toLowerCase()))
                        setservicesCat(filterData)
                        setloading(false);
                    }
                });
            }catch(err){
                console.log(err)
                setloading(false)
            }    
        }else{
            getServices()
        }

            

    },[search])

    //?UseNavigate
    const navigate = useNavigate();

    const addServiceClick = () => {
        navigate('/addServiceCategory');
    };

    const handleUpdate = async (id) => {
        navigate(`update/${id}`);
        console.log('update', id);
    };

    const handleDelete = async (id) => {
        await instance({
            method: 'DELETE',
            url: `api/admin/service/category/${id}`
        }).then((res) => {
            console.log(res);
            if (res.status == 200) {
                getServices();
            }
        });

        console.log('delete', id);
    };

        //------------------->Pagination

        const [page, setPage] = React.useState(1);

        const handleChange = (event, value) => {
            getServices(value);
            setPage(value);
        };

    return (
        <TableContainer component={Paper}>
            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                    <CircularProgress />
                </Box>
            ) : (
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell>image</TableCell>
                            <TableCell align="center">Name</TableCell>
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
                        {servicesCat?.length > 0 ? (
                            servicesCat.map((row) => (
                                <TableRow key={row._id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                    <TableCell component="th" scope="row" style={{ borderBottom:'1px solid rgba(224, 224, 224, 1)' }}>
                                        <Stack direction="row" spacing={2} >
                                            <Avatar alt="Cindy Baker" src={row.image} />
                                        </Stack>
                                    </TableCell>
                                    <TableCell align="center">{row.name}</TableCell>
                                    <TableCell align="center">
                                        <LongMenu handleDelete={() => handleDelete(row._id)} handleUpdate={() => handleUpdate(row._id)} />
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow key={'1'} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                <TableCell colSpan={3} align="center">
                                    No Service Category
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            )}
            <Grid justifyContent={'center'} container pt={2}>
                    <Pagination align="center" count={totalPages} page={page} onChange={handleChange} />
            </Grid>
        </TableContainer>
    );
}
