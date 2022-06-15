import { Button, FormControl, Grid, TextField } from '@mui/material';
import { Box } from '@mui/system';
import instance from 'helpers/BaseUrl';
import { useState, useEffect } from 'react';
import MainCard from 'ui-component/cards/MainCard';
import validator from 'validator';
import { useNavigate } from 'react-router';
import ShowMessage from 'helpers/Alert';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';


export default () => {
    //Hooks
    const [Values, setValues] = useState({
        name: '',
        email: '',
        password: ''
    });
    const [emailError, setEmailError] = useState('');
    //For popup
    const [message, setmessage] = useState('');
    const [openMessage, setopenMessage] = useState(false);

    ///Set timeout for popup message

    useEffect(() => {
        setTimeout(() => {
            setopenMessage(false);
        }, 5000);
    }, [openMessage]);

    const handleChange = (e) => {
        setValues({ ...Values, [e.target.name]: e.target.value });
    };

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await instance({
                method: 'POST',
                url: 'api/admin/signup',
                data: Values
            }).then((res) => {
                if (res.status == 201) {
                    setopenMessage(true);
                    setmessage('Admin created !');
                    navigate('/admin');
                }
            });
        } catch (err) {
            setopenMessage(true);
            setmessage('Something went wrong !');
            console.log(err);
        }
    };

    const handleKeyPress = (e) => {
        if ('1234567890!@#$%^&*'.includes(e.key)) {
            e.preventDefault();
        }
    };

    //--------------------> Validate email function

    const validateEmail = (e) => {
        let mail = e.target.value;

        if (!validator.isEmail(mail)) {
            console.log('callsed');
            setEmailError('Enter valid email !');
        } else {
            setEmailError('');
        }
    };

    const { name, password, email } = Values;

    return (
        <MainCard title="Add Admin" className="main-card-title">
            <h5 className="back-arrow">
                <ArrowBackIcon onClick={() => navigate('/admin')} />
            </h5>
            <Box sx={{ flexGrow: 1 }}>
                <form onSubmit={handleSubmit}>
                    <Grid container spacing={5}>
                        <Grid item xs={4}>
                            <FormControl fullWidth>
                                <TextField
                                    onKeyPress={handleKeyPress}
                                    onChange={handleChange}
                                    value={name}
                                    name="name"
                                    variant="outlined"
                                    label="Name"
                                />
                            </FormControl>
                        </Grid>
                        <Grid item xs={4}>
                            <FormControl fullWidth>
                                <TextField
                                    onChange={handleChange}
                                    onBlur={validateEmail}
                                    value={email}
                                    type={'email'}
                                    name="email"
                                    variant="outlined"
                                    label="Email"
                                />
                            </FormControl>
                            <span style={{ fontWeight: 'bold', color: 'red' }}>{emailError}</span>
                        </Grid>
                        <Grid item xs={4}></Grid>
                        <Grid item xs={4}>
                            <FormControl fullWidth>
                                <TextField onChange={handleChange} value={password} name="password" variant="outlined" label="Password" />
                            </FormControl>
                        </Grid>
                        <Grid item xs={12}>
                            <Button disabled={name && !emailError && password ? false : true} type="submit" variant="contained">
                                Submit
                            </Button>
                        </Grid>
                        <Grid item xs={4}></Grid>
                    </Grid>
                </form>
            </Box>

            {/* -----------------------------> Popup */}

            <ShowMessage message={message} open={openMessage} />
        </MainCard>
    );
};
