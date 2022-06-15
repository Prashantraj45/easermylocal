import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import MainCard from 'ui-component/cards/MainCard';
import Button from '@mui/material/Button';
import React, { useState, useEffect } from 'react'


//? material-ui
import { TextField,FormControl, } from '@material-ui/core';
import { fileUpload } from 'helpers/Upload';
import instance from 'helpers/BaseUrl';
import { useNavigate, useParams } from 'react-router';
import { CircularProgress } from '@mui/material';



export default () => {


    //------------------------------------->Hooks
    const [Values, setValues] = React.useState({
        name:'',
        image:'',
    })
    const [imageLoading, setimageLoading] = useState(false)


    const {id} = useParams()
    console.log(id)
    


    useEffect(async () => {

        if(id){
            await instance({
                method:'GET',
                url:`api/admin/service/category/${id}`,
            }).then(res => {
                console.log(res)
                let data = res.data.cat
                setValues({...Values,name:data.name,image:data.image})
            })
        }

        
    },[])
    
    const {name, image} = Values



    const handleChange = async (e) => {
        if(e.target.name == 'image'){
            setimageLoading(true)
            let  { location } = await fileUpload(e.target.files[0])
            console.log(location)
            if (location) {
                setimageLoading(false)
                setValues({...Values,[e.target.name]:location})
                return;
            }
        }else{
            setValues({...Values, [e.target.name] : e.target.value})
            console.log(Values)
        }
    };

    //Navigate to back page
    let navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (id) {
        console.log(Values)
        await instance({
            method:'PUT',
            url:`api/admin/service/category/${id}`,
            data:Values,
        }).then(res => {
            if (res.status == 200) {
                navigate(-1)
            }
            console.log(res)
        })
        }

    }

    return (
        <MainCard title='Update Service Category'>
            <Box sx={{ flexGrow: 1 }}>
                    <form onSubmit={handleSubmit}>
                <Grid container xs={8} spacing={5}>
                    <Grid item xs={6}>
                        <FormControl width={'50%'}>
                            <TextField required onChange={handleChange} id="standard-basic" label="Name" name='name' value={name} variant="standard" />
                        </FormControl>
                    </Grid>
                    
                    <Grid item xs={6}>
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
                    </Grid>
                </Grid><br />
                <Grid xs={6} >
                <Button disabled={imageLoading} type='submit' variant="contained">Submit</Button>
                </Grid>
                </form>
            </Box>
        </MainCard>
    );
};
