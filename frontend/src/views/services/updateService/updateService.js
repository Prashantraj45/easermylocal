import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import MainCard from 'ui-component/cards/MainCard';
import Button from '@mui/material/Button';
import React, { useState, useEffect } from 'react';

//? material-ui
import { InputLabel, TextField, FormControl } from '@material-ui/core';
import { fileUpload } from 'helpers/Upload';
import instance from 'helpers/BaseUrl';
import NativeSelect from '@mui/material/NativeSelect';
import { useNavigate, useParams } from 'react-router';
import CircularProgress from '@mui/material/CircularProgress';
import Stack from '@mui/material/Stack';
import Chip from '@mui/material/Chip';
import Autocomplete from '@mui/material/Autocomplete';

export default () => {
    //------------------------------------->Hooks
    const [Values, setValues] = React.useState({
        name: '',
        category: '',
        partner: null,
        description: '',
        image: ''
    });

    const [categories, setcategories] = useState([]);
    const [partners, setpartners] = useState([]);
    const [loading, setloading] = useState(true);
    const [imageLoading, setimageLoading] = useState(false);

    const { id } = useParams();

    useEffect(async () => {
         instance({
            method: 'GET',
            url: `api/admin/service/category?limit=5&page=1`
        }).then((res) => {
            setcategories(res.data?.data);
        });
        await instance({
            method: 'GET',
            url: `api/partner/?limit=5&page=1`
        }).then((res) => {
            setpartners(res.data.partners);
        });

        if (id) {
            await instance({
                method: 'GET',
                url: `api/admin/service/${id}`
            }).then((res) => {
                let data = res.data.service;
                setValues({
                    ...Values,
                    name: data.name,
                    description: data.description,
                    category: data.category?.name,
                    partner: data.partner?.name,
                    image: data.image
                });
                setloading(false);
            });
        }
    }, [id]);

    const { name, category, partner, image, description } = Values;

    const handleChange = async (e) => {
        if (e.target.name == 'image') {
            setimageLoading(true);
            let { location } = await fileUpload(e.target.files[0]);
            if (location) {
                setValues({ ...Values, [e.target.name]: location });
                setimageLoading(false);
                return;
            }
        } else {
            setValues({ ...Values, [e.target.name]: e.target.value });
        }
    };

    //Navigate to back page
    let navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (id) {
            await instance({
                method: 'PUT',
                url: `api/admin/service/${id}`,
                data: Values
            }).then((res) => {
                if (res.status == 200) {
                    navigate(-1);
                }
            });
        }
    };

    
    const selectedCategory = (cat) => {

        let temp = []
        cat.map(x => {
            console.log(x)
            temp.push(x._id)
        })

        setValues({...Values,category:temp})

    }

    return loading ? (
        <>
            <Box sx={{ display: 'flex' }}>
                <CircularProgress />
            </Box>
        </>
    ) : (
        <MainCard title="Update Service">
            <Box sx={{ flexGrow: 1, justifyContent: 'center' }}>
                <form onSubmit={handleSubmit}>
                    <Grid container xs={8} spacing={5}>
                        <Grid item xs={6}>
                            <FormControl width={'50%'}>
                                <TextField
                                    required
                                    onChange={handleChange}
                                    id="standard-basic"
                                    label="Name"
                                    name="name"
                                    value={name}
                                    variant="standard"
                                />
                            </FormControl>
                        </Grid>
                        
                    <Grid item xs={6}>
                            <Stack spacing={3} sx={{ width: 500 }}>
                                <Autocomplete
                                    fullWidth
                                    multiple
                                    id="tags-outlined"
                                    value={['dfasd','dfsa']}
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
                        {/* <Grid item xs={3}>
                            <FormControl width="60%" fullWidth>
                                <InputLabel variant="standard" htmlFor="uncontrolled-native"></InputLabel>
                                <NativeSelect name="category" value={category} onChange={handleChange}>
                                    <option key={0}>{Values.category ? Values.category : 'Select Category'}</option>
                                    {console.log(categories)}
                                    {categories &&
                                        categories.map((res) => {
                                            return (
                                                <option key={res._id} value={res._id}>
                                                    {res.name}
                                                </option>
                                            );
                                        })}
                                </NativeSelect>
                            </FormControl>
                        </Grid> */}
                        {/* <Grid item xs={6}>
                            <Grid item xs={4.5}>
                                <FormControl width="60%" fullWidth>
                                    <InputLabel variant="standard" htmlFor="uncontrolled-native"></InputLabel>
                                    {console.log(Values)}
                                    <NativeSelect name="partner" value={partner} onChange={handleChange}>
                                        <option>{Values.partner ? Values.partner : 'Select Category'}</option>
                                        {console.log(partners)}
                                        {partners &&
                                            partners.map((res) => {
                                                return (
                                                    <option key={res._id} value={res._id}>
                                                        {res.name}
                                                    </option>
                                                );
                                            })}
                                    </NativeSelect>
                                </FormControl>
                            </Grid>
                        </Grid> */}

                        <Grid item xs={6}>
                            <FormControl width={'50%'}>
                                <TextField
                                    required
                                    onChange={handleChange}
                                    name="description"
                                    value={description}
                                    multiline={true}
                                    minRows={5}
                                    id="standard-basic"
                                    label="Description"
                                    variant="standard"
                                />
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
                                    name="image"
                                    variant="standard"
                                    style={{ border: '0' }}
                                />
                            </FormControl>
                            {imageLoading ? (
                                <Box sx={{ display: 'flex' }}>
                                    <CircularProgress />
                                </Box>
                            ) : null}
                        </Grid>
                    </Grid>
                    <br />
                    <Grid xs={6}>
                        <Button disabled={imageLoading} type="submit" variant="contained">
                            Submit
                        </Button>
                    </Grid>
                </form>
            </Box>
        </MainCard>
    );
};
