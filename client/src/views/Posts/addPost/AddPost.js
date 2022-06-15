import { FormControl, Grid, TextField, Autocomplete, Chip, Button, MenuItem } from '@mui/material';
import { Box } from '@mui/system';
import instance from 'helpers/BaseUrl';
import React, { useState, useEffect } from 'react';
import MainCard from 'ui-component/cards/MainCard';
import { useNavigate } from 'react-router';
import ShowMessage from 'helpers/Alert';
import Select from '@mui/material/Select';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';


export default () => {
    //-----------------> Hooks
    const [Values, setValues] = useState({
        description: '',
        tags: [],
        serviceCategory:'',
    });
    const [category, setcategory] = useState([]);

    //---------------> PopUp modal and message
    const [openMessage, setopenMessage] = useState(false);
    const [message, setmessage] = useState('');

    ///Set timeout for popup message

    useEffect(() => {
        setTimeout(() => {
            setopenMessage(false);
        }, 5000);
    }, [openMessage]);

    useEffect(async () => {
        try {
            await instance({
                method: 'GET',
                url: 'api/admin/service/category'
            }).then((res) => {
                if (res.status === 200) {
                    console.log(res.data);
                    setcategory(res.data.data);
                }
            });
        } catch (err) {
            setopenMessage(true);
            setmessage('Faile to load category');
        }
    }, []);

    //--------------> OnChnage
    const handleChange = (e) => {
        setValues({ ...Values, [e.target.name]: e.target.value });
    };

    //-----------> Navigator
    const navigate = useNavigate();

    //--------------> Form Submit
    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log(Values);

        try {
            await instance({
                method: 'POST',
                url: '/api/post',
                data: Values
            }).then((res) => {
                console.log(res);
                if (res.status === 200) {
                    setmessage('Post Created !');
                    setopenMessage(true);
                    navigate('/posts');
                }
            });
        } catch (err) {
            setmessage('Something went wrong !');
            setopenMessage(true);
        }
    };

    const { description, tags, serviceCategory } = Values;

    return (
        <MainCard title="Add Post" className="main-card-title">
        <h5 className="back-arrow">
            <ArrowBackIcon onClick={() => navigate('/posts')} />
        </h5>
            <Box sx={{ flexGrow: 1 }}>
                <form onSubmit={handleSubmit}>
                    <Grid container spacing={5} xs={8}>
                        <Grid item sm={12} lg={6}>
                            <FormControl fullWidth>
                                {console.log(category)}
                                <Select
                                    labelId="demo-simple-select-standard-label"
                                    id="demo-simple-select-standard"
                                    name='serviceCategory'
                                    onChange={handleChange}
                                    label="Category"
                                >
                                    {
                                        category &&
                                        category.map(x => {
                                            return <MenuItem value={x._id} key={x._id}>{x.name}</MenuItem>
                                        })
                                    }
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item lg={6} sm={12}>
                            <FormControl fullWidth>
                                <TextField
                                    name="description"
                                    value={description}
                                    onChange={handleChange}
                                    variant="outlined"
                                    label="Description"
                                />
                            </FormControl>
                        </Grid>
                        <Grid item lg={6} sm={12}>
                            <Autocomplete
                                multiple
                                id="tags-filled"
                                options={[]}
                                freeSolo
                                variant="outlined"
                                onChange={(e, tags) => {
                                    setValues({ ...Values, tags: tags });
                                }}
                                renderTags={(value, getTagProps) =>
                                    value.map((option, index) => <Chip variant="outlined" label={option} {...getTagProps({ index })} />)
                                }
                                renderInput={(params) => <TextField {...params} variant="filled" label="Tags" placeholder="Favorites" />}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Button type="submit" disabled={serviceCategory && description && tags.length ? false :true} variant="contained">
                                Submit
                            </Button>
                        </Grid>
                    </Grid>
                </form>
            </Box>

            {/* -----------------------------> Popup */}

            <ShowMessage message={message} open={openMessage} />
        </MainCard>
    );
};
