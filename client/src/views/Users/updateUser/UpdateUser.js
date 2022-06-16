import { TrendingUpRounded } from '@mui/icons-material';
import { Button, FormControl, Grid, TextField, Typography } from '@mui/material';
import { Box } from '@mui/system';
import instance from 'helpers/BaseUrl';
import { useEffect, useState } from 'react';
import MainCard from 'ui-component/cards/MainCard';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import { useNavigate } from 'react-router';
import { CircularProgress } from '@mui/material';
import ShowMessage from 'helpers/Alert';
import { fileUpload } from 'helpers/Upload';
import { useParams } from 'react-router';
import validator from 'validator'

export default () => {
    //Hooks
    const [Values, setValues] = useState({
        name: '',
        email: '',
        image: '',
        phone: ''
    });
    const [imageLoading, setimageLoading] = useState(false);
    const [message, setmessage] = useState('');
    const [openMessage, setopenMessage] = useState(false);
    const [loading, setloading] = useState(true);
    const [emailError, setEmailError] = useState('')

    // get id from url
    let { id } = useParams();

    useEffect(async () => {
        
        try{

            await instance({
                method: 'GET',
                url: `/api/user/${id}`
            }).then((res) => {
                console.log(res);
                let data = res?.data?.user;
                setloading(false);
                setValues({
                    name: data.name,
                    image: data.image,
                    email: data.email,
                    phone: data.phone
                });
            });

        }catch(err){
            setloading(false);
            setopenMessage(true);
            setmessage('Something went wrong !');
        }

        
    }, [id]);

    const handleChange = async (e) => {
        if (
            e.target.name == 'image' ||
            e.target.name == 'passport' ||
            e.target.name == 'drivingLicense' ||
            e.target.name == 'biometricResidencePermit' ||
            e.target.name == 'citizenCard' ||
            e.target.name == 'nationalIdentityCard'
        ) {
            setimageLoading(true);
            let { location } = await fileUpload(e.target?.files[0]);
            if (location) {
                console.log(location);
                setimageLoading(false);
                setValues({ ...Values, [e.target.name]: location });
                return;
            }
        } else {
            setValues({ ...Values, [e.target.name]: e.target.value });
        }
    };

    ///Set timeout for popup message

    useEffect(() => {
        setTimeout(() => {
            setopenMessage(false);
        }, 5000);
    }, [openMessage]);

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        console.log(Values);

        try {
            await instance({
                method: 'PUT',
                url: `api/user/${id}`,
                data: Values
            }).then((res) => {
                if (res.status == 200) {
                    setmessage('User Created !');
                    setopenMessage(true);
                    navigate(-1);
                }
            });
        } catch (err) {
            console.log(err);

            if (err.response) {
                if ('email' in err.response?.data?.err?.keyValue) {
                    setmessage('Email already exist !');
                    setopenMessage(true);
                    // alert("email already exist !")
                } else if ('phone' in err.response?.data?.err?.keyValue) {
                    setmessage('Phone Number already exist !');
                    setopenMessage(true);
                } else {
                    setmessage('Something went wrong !');
                    setopenMessage(true);
                }
            }
        }
    };

    const handleKeyPress = (e) => {
        if ('1234567890!@#$%^&*'.includes(e.key)) {
            e.preventDefault();
        }
    };

            //---------------------------> function for phone numbre validation 

            const validatePhone = (e) => {

                if(e.key == '.'||e.key == 'e' || e.key == '+' || e.key == 'E' || e.key == '-'){
                    e.preventDefault()
                }
        
                if((e.target.value).length === 10){
                    if (!(e.key === "Backspace")) {
                        e.preventDefault()
                    }
                }
                
            }

            
        //--------------------> Validate email function

        const validateEmail = (e) => {
            let mail = e.target.value

            if(!(validator.isEmail(mail))){
                setEmailError('Enter valid email !')
            }else{
                setEmailError('')
            }

        }

    const { name, email, phone } = Values;

    return (
        <MainCard title="Update User">
            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                    <CircularProgress />
                </Box>
            ) : (
                <Box sx={{ flexGrow: 1 }}>
                    {
                        Values.email
                        ?

                    
                    <form onSubmit={handleSubmit}>
                        <Grid container spacing={5} xs={8}>
                            <Grid item xs={6}>
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
                            <Grid item xs={6}>
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
                            <span style={{fontWeight:'bold',color:'red'}} >{emailError}</span>
                            </Grid>
                            {/* <Grid item xs={6}>
                            <FormControl fullWidth>
                                <TextField type={'password'} onChange={handleChange} value={password} name="password" variant="outlined" label="Password" />
                            </FormControl>
                        </Grid> */}
                            <Grid item xs={6}>
                                <FormControl fullWidth>
                                    <TextField
                                        onChange={handleChange}
                                        onWheel={(e) => e.target.blur()}
                                        type={'number'}
                                        name="phone"
                                        value={phone}
                                        label="Phone No"
                                        variant="outlined"
                                        onKeyDown={validatePhone}
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item xs={6}>
                                <FormControl fullWidth width="60%">
                                    <TextField
                                        onChange={handleChange}
                                        InputProps={{
                                            disableUnderline: true
                                        }}
                                        inputProps={{ accept: 'image/png, image/jpeg' }}
                                        type={'file'}
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
                            <Grid item xs={12}>
                                <Button disabled={name && (!emailError) && !imageLoading ? false : true} type="submit" variant="contained">
                                    Submit
                                </Button>
                            </Grid>
                        </Grid>
                    </form>
                    :
                    <Typography align='center'>User not found !</Typography>
                                }
                </Box>
            )}
            {/* -----------------------------> Popup */}

            <ShowMessage message={message} open={openMessage} />
        </MainCard>
    );
};
