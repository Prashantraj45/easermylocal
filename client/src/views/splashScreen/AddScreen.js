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
import Select from 'react-select';

export default () => {
    //--------------------------> Hooks
    const [Values, setValues] = useState({
        title: '',
        image: '',
        description: ''
    });
    const [imageLoading, setimageLoading] = useState(false);

    const navigate = useNavigate();

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

    const handleKeyPress = (e) => {
        if ('1234567890!@#$%^&*'.includes(e.key)) {
            e.preventDefault();
        }
    };

    const { title, image, description } = Values;

    //-----------validation function

    const validate = () => {
        let value = true;

        if (!title) {
            alert('enter all fields !');
            value = false;
        } else if (!description) {
            alert('enter all fields !');
            value = false;
        }

        return value;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (validate()) {
            console.log(Values);
            await instance({
                method: 'POST',
                url: 'api/splash',
                data: Values
            }).then((res) => {
                if (res.status == 200) {
                    navigate(-1);
                }
                console.log(res);
            });
        }
    };

    const options = [
        { value: true, label: 'True' },
        { value: false, label: 'False' }
    ];

    return (
        <MainCard title="Add Splash Screen" className="main-card-title">
            <h5 className="back-arrow">
                <ArrowBackIcon onClick={() => navigate('/splashscreen')} />
            </h5>
            <Box sx={{ flexGrow: 1 }}>
                <form onSubmit={handleSubmit}>
                    <Grid container xs={8} spacing={5}>
                        <Grid item xs={6}>
                            <FormControl width={'50%'}>
                                <TextField
                                    onKeyPress={handleKeyPress}
                                    onChange={handleChange}
                                    value={title}
                                    name="title"
                                    id="standard-basic"
                                    label="Name"
                                    variant="outlined"
                                />
                            </FormControl>
                        </Grid>

                        <Grid item xs={5}>
                            <Select options={options} name="status" onChange={(e) => setValues({ ...Values, status: e.value })} />
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

                        <Grid item xs={6}>
                            <FormControl width={'50%'}>
                                <TextField
                                    onKeyPress={handleKeyPress}
                                    onChange={handleChange}
                                    value={description}
                                    multiline={true}
                                    rows={3}
                                    name="description"
                                    id="standard-basic"
                                    label="Description"
                                    variant="outlined"
                                />
                            </FormControl>
                        </Grid>

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
                                    name="image"
                                    variant="standard"
                                    style={{ border: '0' }}
                                />
                            </FormControl>
                            {imageLoading ? (
                                <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                                    <CircularProgress />
                                </Box>
                            ) : null}
                            {Values.image ? 'uploaded !' : null}
                        </Grid>
                    </Grid>
                    <br />
                    <Grid xs={6}>
                        <Button type="submit" variant="contained">
                            Submit
                        </Button>
                    </Grid>
                </form>
            </Box>
        </MainCard>
    );
};
