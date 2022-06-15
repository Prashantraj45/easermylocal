import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// material-ui
import { Button, FormControl, Grid, Stack, TextField, Typography } from '@mui/material';

// project imports
import AnimateButton from 'ui-component/extended/AnimateButton';

import instance, { checkToken } from 'helpers/BaseUrl';
import ShowMessage from 'helpers/Alert';
import axios from 'axios';

// ============================|| LOGIN ||============================ //

const Login = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [resetPasswordField, setresetPasswordField] = useState(false);
    //For popup
    const [message, setmessage] = useState('');
    const [openMessage, setopenMessage] = useState(false);

    //-----------> forgot password email
    const [forgotEmail, setforgotEmail] = useState('');
    const [emailError, setemailError] = useState('')

    const [Values, setValues] = useState({
        email: '',
        password: ''
    });

    ///Set timeout for popup message

    useEffect(() => {
        setTimeout(() => {
            setopenMessage(false);
        }, 5000);
    }, [openMessage]);

    const navigate = useNavigate();

    const handleChange = (e) => {
        setValues({ ...Values, [e.target.name]: e.target.value });
    };

    let { password, email } = Values;

    //----------------> Validate function

    let validate = () => {
        let value = false;

        if (password.length > 0) {
            value = true;
        }

        if (email.length > 0) {
            value = true;
        } else {
            value = false;
        }

        return value;
    };

    ///---------------------> Handle login

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (validate()) {
            try {
                await instance({
                    method: 'POST',
                    url: 'api/admin/login',
                    data: Values
                }).then((res) => {
                    console.log(res);
                    if (res.status == 200) {
                        setopenMessage(true);
                        setmessage('Login Successful !');
                        console.log(res.data)
                        localStorage.setItem('auth', res.data.data.token);
                        if (localStorage.getItem('auth')) {
                            navigate('/');
                            checkToken();
                        }
                    } else if (res.status === 201) {
                        setopenMessage(true);
                        setmessage(res.data.message);
                    }
                });
            } catch (err) {
                console.log(err)
                setopenMessage(true);
                setmessage('Invalid Credentials !');
            }
        }
    };

    //---------------------> send link to mail for reset password

    const sendPasswordLink = async () => {

        if (forgotEmail.length > 0) {
            setemailError('')
            try {
                await axios({
                    method: 'POST',
                    url: 'https://easer-dev-api.applore.in/api/admin/resetpasswordlink',
                    data: { forgotEmail }
                }).then((res) => {
                    if (res.status === 200) {
                        setopenMessage(true);
                        setmessage('Passwod reset link sent ! check your mail');
                        setresetPasswordField(false);
                    }
                });
            } catch (err) {
                console.log(err?.response?.data?.message);
                setopenMessage(true);
                setmessage(err?.response?.data?.message);
            }
        }else{
            setemailError("Please enter email !")
        }
    };

    return (
        <>
            {!resetPasswordField ? (
                <form onSubmit={handleSubmit}>
                    <Grid container direction="column" justifyContent="center" spacing={2}>
                        <Grid item xs={12}>
                            <FormControl fullWidth>
                                <TextField onChange={handleChange} required type={'email'} name="email" variant="outlined" label="Email" />
                            </FormControl>
                        </Grid>
                        <Grid item xs={12}>
                            <FormControl fullWidth>
                                <TextField
                                    onChange={handleChange}
                                    required
                                    type={'password'}
                                    name="password"
                                    variant="outlined"
                                    label="Password"
                                />
                                <Typography variant="p" style={{ textAlign: 'right' }} mt={1}>
                                    <a style={{textDecoration:'none'}} onClick={() => setresetPasswordField(true)} href="#">
                                        Forgot Password?
                                    </a>
                                </Typography>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12}>
                            <AnimateButton>
                                <Button
                                    disableElevation
                                    // disabled={(password && email) ? false : true}
                                    fullWidth
                                    size="large"
                                    type="submit"
                                    variant="contained"
                                    color="secondary"
                                >
                                    Sign in
                                </Button>
                            </AnimateButton>
                        </Grid>
                    </Grid>
                </form>
            ) : (
                <Grid container direction="column" justifyContent="center" spacing={2}>
                    <Grid item xs={12}>
                        <FormControl fullWidth>
                            <TextField
                                onChange={(e) => setforgotEmail(e.target.value)}
                                required
                                type={'email'}
                                name="email"
                                variant="outlined"
                                label="Enter your email"
                            />
                            <Typography variant="p" style={{ textAlign: 'right' }} mt={1}>
                        <a style={{textDecoration:'none'}} onClick={() => setresetPasswordField(false)} href="#">
                            Already have account?
                        </a>
                            </Typography>
                        </FormControl>
                    </Grid>
                                                    <Grid item xs={12}>
                                                        <span style={{fontWeight:'bold',color:'red'}} >{emailError}</span>
                                                    </Grid>

                    <Grid item xs={12}>
                        <AnimateButton>
                            <Button
                                disableElevation
                                // disabled={forgotEmail ? false : true}
                                onClick={sendPasswordLink}
                                fullWidth
                                size="large"
                                type="submit"
                                variant="contained"
                                color="secondary"
                            >
                                send link
                            </Button>
                        </AnimateButton>
                    </Grid>
                    {/* <Grid textAlign={'right'} item xs={12}>
                        <a style={{textDecoration:'none'}} onClick={() => setresetPasswordField(false)} href="#">
                            Already have account?
                        </a>
                    </Grid> */}
                </Grid>
            )}
            {/* -----------------------------> Popup */}

            <ShowMessage message={message} open={openMessage} />
        </>
    );
};

export default Login;
