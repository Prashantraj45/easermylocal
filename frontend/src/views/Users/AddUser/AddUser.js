import { Button, FormControl, Grid, TextField } from '@mui/material';
import { Box } from '@mui/system';
import instance from 'helpers/BaseUrl';
import { useEffect, useState } from 'react';
import MainCard from 'ui-component/cards/MainCard';
import { useNavigate } from 'react-router';
import { CircularProgress } from '@mui/material';
import ShowMessage from 'helpers/Alert';
import { fileUpload } from 'helpers/Upload';
import FileInput from 'helpers/FileInput/FileInput';
import validator from 'validator'
import ArrowBackIcon from '@mui/icons-material/ArrowBack';


export default () => {
    //Hooks
    const [Values, setValues] = useState({
        name: '',
        email: '',
        password: '',
        image:'',
        phone:'',
        referralCode:''
    });
    const [imageLoading, setimageLoading] = useState(false);
    const [message, setmessage] = useState('')
    const [openMessage, setopenMessage] = useState(false)
    const [emailError, setEmailError] = useState('')

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
            setopenMessage(false)
        }, 5000);
    },[openMessage])


    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        console.log(Values)

        try {
            await instance({
                method: 'POST',
                url: 'api/user',
                data: Values
            }).then((res) => {
                if (res.status == 200) {
                    setmessage("User Created !")
                    setopenMessage(true)
                    navigate(-1);
                }
            });
        } catch (err) {
            console.log(err);

            if(err){
                
            if('email' in err.response?.data?.err?.keyValue){
                setmessage("Email already exist !")
                setopenMessage(true)
                // alert("email already exist !")
            }else if('phone' in err.response?.data?.err?.keyValue){
                setmessage("Phone Number already exist !")
                setopenMessage(true)
            }else{
                setmessage("Something went wrong !")
                setopenMessage(true)

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

    const { name, password, email, phone , referralCode} = Values;

    return (
        <MainCard title="Add User" className="main-card-title">
        <h5 className="back-arrow">
            <ArrowBackIcon onClick={() => navigate('/user')} />
        </h5>
            <Box sx={{ flexGrow: 1 }}>
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
                        <Grid item xs={6}>
                            <FormControl fullWidth>
                                <TextField autoComplete='new-password' type={'password'} onChange={handleChange} value={password} name="password" variant="outlined" label="Password" />
                            </FormControl>
                        </Grid>
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
                            <FormControl fullWidth>
                                <TextField
                                    onChange={handleChange}
                                    value={referralCode}
                                    type={'text'}
                                    name="referralCode"
                                    variant="outlined"
                                    label="Referral Code"
                                />
                            </FormControl>
                        </Grid>
                        <Grid item xs={6}>
                            <FormControl fullWidth>
                                <FileInput width='100%' name='image' Values={Values} changeHandler={handleChange} />
                                {/* <TextField
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
                                /> */}
                            </FormControl>
                            {imageLoading ? (
                                <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                                    <CircularProgress />
                                </Box>
                            ) : null}
                            {Values.image ? 'uploaded !' : null}
                        </Grid>
                        <Grid item xs={12}>
                            <Button disabled={name && (!emailError) && password && phone && !imageLoading ? false : true} type="submit" variant="contained">
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
