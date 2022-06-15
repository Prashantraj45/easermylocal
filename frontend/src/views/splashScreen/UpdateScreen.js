import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import MainCard from 'ui-component/cards/MainCard';
import Button from '@mui/material/Button';

//? material-ui
import { TextField, FormControl, MenuItem, Avatar } from '@material-ui/core';
import { useState } from 'react';
import { fileUpload } from 'helpers/Upload';
import instance from 'helpers/BaseUrl';
import { CircularProgress } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate, useParams } from 'react-router';
import { useEffect } from 'react';
import Select from 'react-select';
import Stack from '@mui/material/Stack';
import ShowMessage from 'helpers/Alert';

export default () => {
    //--------------------------> Hooks
    const [Values, setValues] = useState({
        name: '',
        image: '',
        description: '',
        status: ''
    });
    const [imageLoading, setimageLoading] = useState(false);
    const [message, setmessage] = useState('');
    const [openMessage, setopenMessage] = useState(false);

    const navigate = useNavigate();

    const { id } = useParams();
    console.log(id);

    useEffect(async () => {
        if (id) {
            await instance({
                method: 'GET',
                url: `api/splash/${id}`
            }).then((res) => {
                console.log(res);
                let data = res.data.screen;
                setValues({ ...Values, name: data.title, image: data.image, description: data.description, status: data.status });
            });
        }
    }, []);

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

    const { name, image, description, status } = Values;

    //-----------validation function

    const validate = () => {
        let value = true;

        if (!name) {
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
        }

        await instance({
            method: 'PUT',
            url: `api/splash/${id}`,
            data: Values
        }).then((res) => {
            if (res.status == 200) {
                setmessage("Screen Update !")
                setopenMessage(true)
                navigate(-1);
            }
            console.log(res);
        });
    };

    const options = [
        { value: true, label: 'True' },
        { value: false, label: 'False' }
    ];

    const selected = { label: status, value: status };

    return (
        <MainCard title="Update Splash Screen" className="main-card-title">
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
                                    value={name}
                                    name="name"
                                    id="standard-basic"
                                    label="Name"
                                    variant="outlined"
                                />
                            </FormControl>
                        </Grid>

                        <Grid item xs={5}>
                            {console.log(status)}
                            <Select
                                options={options}
                                name="status"
                                placeholder={status ? 'True' : 'False'}
                                onChange={(e) => setValues({ ...Values, status: e.value })}
                            />
                        </Grid>

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

                        <Grid item xs={1}>
                            
                        <Stack direction="row" spacing={2} mt={2} >
                                <Avatar alt="Cindy Baker" src={image} />
                            </Stack>
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
                            {/* {Values.image ? 'uploaded !' : null} */}
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
            
            {/* -----------------------------> Popup */}

            <ShowMessage message={message} open={openMessage} />
        </MainCard>
    );
};
