import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

// material-ui
import { Button, FormControl, Grid, Stack, TextField } from '@mui/material';

// project imports
import AnimateButton from 'ui-component/extended/AnimateButton';

import instance, { checkToken } from 'helpers/BaseUrl';
import Alert from '@mui/material/Alert';
import AuthWrapper1 from '../AuthWrapper1';
import AuthCardWrapper from '../AuthCardWrapper';
import { Divider, Typography, useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import AuthFooter from 'ui-component/cards/AuthFooter';
import ShowMessage from 'helpers/Alert';

// ============================|| LOGIN ||============================ //

const PasswordReset = () => {
    //------------------------> Material ui
    const theme = useTheme();
    const matchDownSM = useMediaQuery(theme.breakpoints.down('md'));


    const [Values, setValues] = useState({
        password: '',
        confirmPassword: ''
    });
        //For popup and error
        const [message, setmessage] = useState('')
        const [openMessage, setopenMessage] = useState(false)
        const [passwordError, setpasswordError] = useState('')
 

                
    ///Set timeout for popup message 

    useEffect(() => {
        setTimeout(() => {
            setopenMessage(false)
        }, 5000);
    },[openMessage])

    const navigate = useNavigate();
    const params = useParams()
    const {id} = params

    const handleChange = (e) => {
        setValues({ ...Values, [e.target.name]: e.target.value });
    };

    
    let { password, confirmPassword } = Values;


    //-----------validation function

    const validate = () => {
        
        let value = false

        if (password.length < 8) {
            setpasswordError('Password must be 8 carector long !')
            value = false
        }else if (Values.password !== Values.confirmPassword) {
            setpasswordError('Password mismatch !')
            value = false
        }else if(Values.password === Values.confirmPassword){
            setpasswordError('')
            value = true
        }

        return value

    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (validate()) {
            try {
                await instance({
                    method: 'POST',
                    url: `api/admin/resetpassword/${id}`,
                    data: Values
                }).then((res) => {
                    console.log(res);
                    if (res.status == 200) {
                        setmessage(res.data.message)
                        setopenMessage(true)
                        setTimeout(() => {
                        navigate('/login')
                    }, 4000);
                        localStorage.setItem('auth', res.data.data.token);
                        if (localStorage.getItem('auth')) {
                                navigate('/');
                                checkToken();
                        }
                    }
                });
            } catch (err) {
                // setmessage('Somwthing went wrong !')
                setopenMessage(true)
            }
        }
        
    };



    return (
        <>
            <AuthWrapper1>
                {' '}
                <Grid container direction="column" justifyContent="flex-end" sx={{ minHeight: '100vh' }}>
                    <Grid item xs={12}>
                        <Grid container justifyContent="center" alignItems="center" sx={{ minHeight: 'calc(100vh - 68px)' }}>
                            <Grid item sx={{ m: { xs: 1, sm: 3 }, mb: 0 }}>
                                <AuthCardWrapper>
                                    <Grid container spacing={2} alignItems="center" justifyContent="center">
                                        <Grid item xs={12}>
                                            <Grid
                                                container
                                                direction={matchDownSM ? 'column-reverse' : 'row'}
                                                alignItems="center"
                                                justifyContent="center"
                                            >
                                                <Grid item>
                                                    <Stack alignItems="center" justifyContent="center" spacing={1}>
                                                        <Typography
                                                            variant="caption"
                                                            fontSize="16px"
                                                            textAlign={matchDownSM ? 'center' : 'inherit'}
                                                        >
                                                            Enter password and confirm password
                                                        </Typography>
                                                    </Stack>
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                        <Grid item xs={12}>
                                            <form onSubmit={handleSubmit}>
                                                <Grid container direction="column" justifyContent="center" spacing={2}>
                                                    <Grid item xs={12}>
                                                        <FormControl fullWidth>
                                                            <TextField
                                                                onChange={handleChange}
                                                                required
                                                                type={'password'}
                                                                name="password"
                                                                value={password}
                                                                variant="outlined"
                                                                label="New Password"
                                                            />
                                                        </FormControl>
                                                    </Grid>
                                                    <Grid item xs={12}>
                                                        <FormControl fullWidth>
                                                            <TextField
                                                                onChange={handleChange}
                                                                required
                                                                type={'password'}
                                                                value={confirmPassword}
                                                                name="confirmPassword"
                                                                variant="outlined"
                                                                label="Confirm Password"
                                                            />
                                                        </FormControl>
                                                    </Grid>
                                                    <Grid item xs={12}>
                                                        <span style={{fontWeight:'bold',color:'red'}} >{passwordError}</span>
                                                    </Grid>
                                                    <Grid item xs={12}>
                                                        <AnimateButton>
                                                            <Button
                                                                disableElevation
                                                                // disabled={password && confirmPassword && !passwordError ? false : true}
                                                                fullWidth
                                                                size="large"
                                                                type="submit"
                                                                variant="contained"
                                                                color="secondary"
                                                            >
                                                                Reset Password
                                                            </Button>
                                                        </AnimateButton>
                                                    </Grid>
                                                </Grid>
                                            </form>
                                        </Grid>
                                        <Grid item xs={12}>
                                            {/* <Divider /> */}
                                        </Grid>
                                    </Grid>
                                </AuthCardWrapper>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs={12} sx={{ m: 3, mt: 1 }}>
                        <AuthFooter />
                    </Grid>
                </Grid>
            </AuthWrapper1>
                    {/* -----------------------------> Popup */}

        <ShowMessage message={message} open={openMessage} />

        </>
    );
};

export default PasswordReset;
