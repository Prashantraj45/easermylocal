import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import MainCard from 'ui-component/cards/MainCard';
import Button from '@mui/material/Button';
import React, { useState, useEffect } from 'react'


//? material-ui
import { InputLabel, TextField, FormHelperText, MenuItem, Select, FormControl, FilledInput } from '@material-ui/core';
import { fileUpload } from 'helpers/Upload';
import instance from 'helpers/BaseUrl';
import NativeSelect from '@mui/material/NativeSelect';
import { useNavigate } from 'react-router';
import { CircularProgress } from '@mui/material';
import Stack from '@mui/material/Stack';
import Chip from '@mui/material/Chip';
import Autocomplete from '@mui/material/Autocomplete';


export default () => {


    //------------------------------------->Hooks
    const [Values, setValues] = React.useState({
        name:'',
        category:'',
        partner:null,
        description:'',
        image:'',
    })

    const [categories, setcategories] = useState([])
    const [partners, setpartners] = useState([])
    const [imageLoading, setimageLoading] = useState(false)

    
    useEffect(async () => {
        await instance({
            method:'GET',
            url:'api/admin/service/category?limit=5&page=1'
        }).then(res => {
            setcategories(res.data.data)
            console.log(res)
        })
        await instance({
            method:'GET',
            url:`api/partner/?limit=5&page=1`,
        }).then(res => {
            setpartners(res.data.partners)
            console.log(res)
        })
        
    },[])
    
    const {name, category, partner, image, description} = Values



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
        console.log(Values)
        instance({
            method:'POST',
            url:`api/admin/service`,
            data:Values,
        }).then(res => {
            if (res.status == 200) {
                navigate(-1)
            }
            console.log(res)
        })
    }

    const selectedCategory = (cat) => {

        let temp = []
        cat.map(x => {
            console.log(x)
            temp.push(x._id)
        })

        setValues({...Values,category:temp})

    }

    return (
        <MainCard title='Add Services'>
            <Box sx={{ flexGrow: 1 }}>
                    <form onSubmit={handleSubmit}>
                <Grid container xs={8} spacing={5}>
                    <Grid item xs={6}>
                        <FormControl fullWidth >
                            <TextField required onChange={handleChange} id="standard-basic" label="Name" name='name' value={name} variant="outlined" />
                        </FormControl>
                    </Grid>
                    {/* <Grid item xs={3}>
                    <FormControl width='60%' fullWidth>
                        <InputLabel variant="standard" htmlFor="uncontrolled-native">
                        </InputLabel>
                        <NativeSelect name='category' value={category} onChange={handleChange} >
                            <option key={1} selected>Select Category</option>
                            {console.log(categories)}
                            {
                                categories && categories.map(res => {
                                    return <option key={res._id} value={res._id}>{res.name}</option>
                                })
                            }
                        </NativeSelect>
                    </FormControl>
                    </Grid> */}
                    
                    <Grid item xs={6}>
                            <Stack spacing={3} sx={{ width: 500 }}>
                                <Autocomplete
                                    fullWidth
                                    multiple
                                    id="tags-outlined"
                                    options={categories}
                                    getOptionLabel={(option) => option.name}
                                    filterSelectedOptions
                                    onChange={(e, mail) => {selectedCategory(mail)}}
                                    renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        variant="outlined"
                                        label="Select Category"
                                        placeholder="Select mail"
                                    />
                                    )}
                                />
                            </Stack>
                            </Grid>
                    {/* <Grid item xs={6}>
                        <Grid item xs={4.5}>
                            <FormControl width='60%' fullWidth>
                                <InputLabel variant="standard" htmlFor="uncontrolled-native">
                                </InputLabel>
                                <NativeSelect name='partner' value={partner} onChange={handleChange} >
                                    <option selected>Select Partner</option>
                                    {console.log(partners)}
                                    {
                                        partners && partners.map(res => {
                                            return <option key={res._id} value={res._id}>{res.name}</option>
                                        })
                                    }
                                </NativeSelect>
                            </FormControl>
                        </Grid>
                    </Grid> */}
                    {/* <Grid item xs={6}>
                        <FormControl width={'50%'}>
                            <TextField required onChange={handleChange} id="standard-basic" label="Partner" name='partner' value={partner} variant="standard" />
                        </FormControl>
                    </Grid> */}
                    
                    {/* <Grid item xs={2}>
                        <FormControl fullWidth>
                            <InputLabel id="demo-simple-select-label">Age</InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                // value={age}
                                label="Age"
                                onChange={handleChange}
                            >
                                <MenuItem value={'true'}>True</MenuItem>
                                <MenuItem value={'false'}>False</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid> */}
                    
                    {/* <Grid item xs={4}>

                    </Grid> */}

                    <Grid item xs={6}>
                        <FormControl fullWidth >
                            <TextField required onChange={handleChange} name='description' value={description} multiline={true} minRows={5} id="standard-basic" label="Description" variant="outlined" />
                        </FormControl>
                    </Grid>

                    <Grid item xs={4}>
                        <FormControl width={'50%'}>
                            <TextField
                            required
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
                </Grid><br />
                <Grid xs={6} >
                <Button disabled={(name && category && image && description) ? false : true } type='submit' variant="contained">Submit</Button>
                </Grid>
                </form>
            </Box>
        </MainCard>
    );
};
