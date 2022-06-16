import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import MainCard from 'ui-component/cards/MainCard';
import Button from '@mui/material/Button';

//? material-ui
import { TextField, FormControl } from '@material-ui/core';
import { useState } from 'react';
import { fileUpload } from 'helpers/Upload';
import instance from 'helpers/BaseUrl';
import { CircularProgress } from '@mui/material';
import { useNavigate } from 'react-router';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';


export default () => {


    //--------------------------> Hooks
    const [Values, setValues] = useState({
        name:'',
        image:''
    })
    const [imageLoading, setimageLoading] = useState(false)

    const navigate = useNavigate()

    const handleChange = async (e) => {
        if (e.target.name == 'image') {
            setimageLoading(true)
            let {location} = await fileUpload(e.target.files[0])
            if (location) {
                setValues({...Values, [e.target.name]:location})
                setimageLoading(false)
                return
            }
        }else{
            setValues({...Values, [e.target.name]:e.target.value})
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault()
        console.log(Values)
    try{
        await instance({
            method:"POST",
            url:'api/admin/service/category',
            data:Values
        }).then(res => {
            if (res.status == 200) {
                navigate(-1)
            }
            console.log(res)
        })
    }
        catch (err) {
            setopenMessage(true);
            setmessage('Something went wrong !');
            console.log(err);
        }
    }

    
    const handleKeyPress = (e) => {
        if ('1234567890!@#$%^&*'.includes(e.key)) {
            e.preventDefault()
        }
    }


    const {name, image} = Values

    return (
        <MainCard title="Add Service" className="main-card-title">
        <h5 className="back-arrow">
            <ArrowBackIcon onClick={() => navigate('/serviceCategories')} />
        </h5>
            <Box sx={{ flexGrow: 1 }}>
                <form onSubmit={handleSubmit} >
                <Grid container xs={8} spacing={5}>
                    <Grid item xs={6}>
                        <FormControl width={'50%'}>
                            <TextField onKeyPress={handleKeyPress} onChange={handleChange} value={name} name="name" id="standard-basic" label="Name" variant="outlined" />
                        </FormControl>
                    </Grid>

                    {/* <Grid item xs={2}>
                        <FormControl fullWidth>
                            <InputLabel id="demo-simple-select-label">Active</InputLabel>
                            <Select
                                name="active"
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                // value={Active}
                                label="Active"
                                onChange={handleChange}
                            >
                                <MenuItem value={'true'}>True</MenuItem>
                                <MenuItem value={'false'}>False</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid> */}
                    <Grid item xs={4}>
                        <FormControl width={'50%'}>
                            <TextField
                                onChange={handleChange}
                                InputProps={{
                                    disableUnderline: true
                                }}
                                type={'file'}
                                id="standard-basic"
                                label="Image"
                                name='image'
                                variant="standard"
                                style={{ border: '0' }}
                            />
                        </FormControl>
                        {
                            imageLoading 
                            ?
                            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                                <CircularProgress />
                            </Box>
                            :
                            null
                        }
                        {Values.image ? 'uploaded !':null}
                    </Grid>
                </Grid>
                <br />
                <Grid xs={6}>
                    <Button disabled={(!imageLoading && name && image) ? false :true} type='submit' variant="contained">Submit</Button>
                </Grid>
                </form>
            </Box>
        </MainCard>
    );
};
