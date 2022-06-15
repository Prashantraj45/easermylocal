import { FormControl, Grid, TextField, Autocomplete, Chip, Button, MenuItem } from '@mui/material';
import { Box } from '@mui/system';
import instance from 'helpers/BaseUrl';
import React, { useState, useEffect } from 'react';
import MainCard from 'ui-component/cards/MainCard';
import { useNavigate,useParams } from 'react-router';
import ShowMessage from 'helpers/Alert';
import Select from '@mui/material/Select';

export default () => {
    //-----------------> Hooks
    const [Values, setValues] = useState({
        description: '',
        tags: [],
        serviceCategory:''
    });
    const [category, setcategory] = useState([]);

    //---------------> PopUp modal and message
    const [openMessage, setopenMessage] = useState(false);
    const [message, setmessage] = useState('');

    
    //-----------> Navigator and params
    const navigate = useNavigate();
    const {id} = useParams()

    ///Set timeout for popup message

    useEffect(() => {
        setTimeout(() => {
            setopenMessage(false);
        }, 5000);
    }, [openMessage]);


    //----------------------> get service category
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

    //---------------------> Get post data by id
    useEffect(async () => {
        try{

            await instance({
                method:"GET",
                url:`api/post/${id}`
            }).then(res => {
                console.log(res.data.post)
                setValues({
                    description:res.data.post.description,
                    tags:res.data.post.tags,
                    serviceCategory:res.data.post.serviceCategory._id
                })
            })

        }catch(err){
            setopenMessage(true);
            setmessage('Faile to load data !');

        }
    },[id])

    //--------------> OnChnage
    const handleChange = (e) => {
        setValues({ ...Values, [e.target.name]: e.target.value });
    };


    //--------------> Form Submit
    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log(Values);

        try {
            await instance({
                method: 'PUT',
                url: `/api/post/${id}`,
                data: Values
            }).then((res) => {
                console.log(res);
                if (res.status === 200) {
                    setmessage('Post Updated !');
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
        <MainCard title="Update Post">
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
                                    value={serviceCategory}
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
                        {console.log(tags)}
                        <Grid item lg={6} sm={12}>
                            <Autocomplete
                            value={tags}
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
                            <Button type="submit" variant="contained">
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
