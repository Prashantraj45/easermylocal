import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import MainCard from 'ui-component/cards/MainCard';
import Button from '@mui/material/Button';

//? material-ui
import { TextField, FormControl } from '@material-ui/core';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import instance from 'helpers/BaseUrl';
import { fileUpload } from 'helpers/Upload';
import Rating from '@mui/material/Rating';
import Typography from '@mui/material/Typography';
import { CircularProgress } from '@mui/material';
import ShowMessage from 'helpers/Alert';
import FileInput from 'helpers/FileInput/FileInput';

import Autocomplete from '@mui/material/Autocomplete';
import Stack from '@mui/material/Stack';
import validator from 'validator';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

export default () => {
    //----------------------------------------->Hooks

    const [Values, setValues] = useState({
        name: '',
        email: '',
        password: '',
        image: '',
        phone: '',
        address: '',
        commission: '',
        rating: '',
        charges: '',
        service: '',
        companyNumber: '',
        aType:"PASSWORD"
    });
    const [categories, setcategories] = useState([]);
    const [services, setservices] = useState([]);
    const [loading, setloading] = useState(true);
    const [imageLoading, setimageLoading] = useState(false);
    const [message, setmessage] = useState('');
    const [openMessage, setopenMessage] = useState(false);
    const [emailError, setEmailError] = useState('');

    const getServices = async () => {
        await instance({
            method: 'GET',
            url: `api/admin/service/category`
        }).then((res) => {
            setloading(false);
            setservices(res.data?.message?.data);
        });
    };

    useEffect(async () => {
        await instance({
            method: 'GET',
            url: 'api/admin/service/category?limit=5&page=1'
        }).then((res) => {
            setcategories(res.data.data);
            console.log(res);
        });
        getServices();
    }, []);

    const handleChange = async (e) => {
        let name = e.target.name;
        if (
            name == 'image' ||
            name == 'passport' ||
            name == 'drivingLicense' ||
            name == 'biometricResidencePermit' ||
            name == 'citizenCard' ||
            name == 'nationalIdentityCard'
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

    const selectedPartner = (users) => {
        let temp = [];
        users.map((x) => {
            temp.push(x._id);
        });
        setValues({ ...Values, service: temp });
    };

    ///Set timeout for popup message

    useEffect(() => {
        setTimeout(() => {
            setopenMessage(false);
        }, 5000);
    }, [openMessage]);

    //useNavigate
    const navigate = useNavigate();

    const handleKeyPress = (e) => {
        if ('1234567890!@#$%^&*'.includes(e.key)) {
            e.preventDefault();
        }
    };

    //---------------------------> function for phone numbre validation

    const validatePhone = (e) => {
        if (e.key == '.' || e.key == 'e' || e.key == '+' || e.key == 'E' || e.key == '-') {
            e.preventDefault();
        }

        if (e.target.value.length === 10) {
            if (!(e.key === 'Backspace')) {
                e.preventDefault();
            }
        }
    };

    //--------------------> Validate email function

    const validateEmail = (e) => {
        let mail = e.target.value;

        if (!validator.isEmail(mail)) {
            setEmailError('Enter valid email !');
        } else {
            setEmailError('');
        }
    };

    const { name, email, password, phone, address, commission, rating, charges, service, image, companyNumber } = Values;

    //-------------------------> Validation function

    const [FormError, setFormError] = useState({
        name: false,
        email: false,
        image: false,
        password: false,
        phone: false,
        service: false,
        address: false,
        charges: false,
        companyNumber: false,
        document:false
    });

    //? Validate
    const Validate = () => {
        let value = true;

        let err = {
            name: false,
            email: false,
            image: false,
            password: false,
            phone: false,
            service: false,
            address: false,
            charges: false,
            companyNumber: false,
            document:false
        };

        setFormError({ ...err });

        if (name === '') {
            err.name = 'Please Enter Name First!';
            value = false;
        }

        if (email === '') {
            err.email = 'Please Enter Email First!';
            value = false;
        }

        if (image === '') {
            err.image = 'Please Select a Image First!';
            value = false;
        }

        if (password === '') {
            err.password = 'Please Select a password First!';
            value = false;
        }

        if (phone === '') {
            err.phone = 'Please Enter Phone Number !';
            value = false;
        }

        if (service === '') {
            err.service = 'Please Select service First!';
            value = false;
        }

        if (charges === '') {
            err.charges = 'Please enter charges !';
            value = false;
        }

        if (address === '') {
            err.address = 'Please enter Address !';
            value = false;
        }

        if (companyNumber === '') {
            err.companyNumber = 'Company Number Required !';
            value = false;
        }

        if (!(Values.passport || Values.drivingLicense || Values.biometricResidencePermit || Values.citizenCard || Values.nationalIdentityCard)) {
            err.document = "Atleast One document required !"
            setopenMessage(true)
            setmessage("Atleast One Document Required !")
            value = false
        }

        setFormError({ ...err });
        return value;
    };

    //------------------> Submit data
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (Validate()) {
            console.log('aaaaaaaaaaaaaaaaaaaaaa', Values);

            try {
                await instance({
                    method: 'POST',
                    url: 'api/partner',
                    data: Values
                }).then((res) => {
                    if (res.status == 200) {
                        navigate(-1);
                    }
                    console.log(res);
                });
            } catch (err) {
                console.log(err.response?.data?.err?.keyValue);
                if (err.response?.data?.err?.keyValue) {
                    if ('email' in err.response?.data?.err?.keyValue) {
                        setmessage('Email already exist !');
                        setopenMessage(true);
                        // alert("email already exist !")
                    } else if ('phone' in err.response?.data?.err?.keyValue) {
                        setmessage('Phone Number already exist !');
                        setopenMessage(true);
                    }
                } else {
                    setmessage('Something went wrong !');
                    setopenMessage(true);
                }
            }
        }
    };

    return (
        <MainCard title="Add Partner" className="main-card-title">
            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                    <CircularProgress />
                </Box>
            ) : (
                <>
                    <h5 className="back-arrow" style={{ top: '0.4%' }}>
                        <ArrowBackIcon onClick={() => navigate('/partner')} />
                    </h5>
                    <Box>
                        <form onSubmit={handleSubmit}>
                            <Grid container spacing={5} p={5}>
                                <Grid item xs={4}>
                                    <FormControl fullWidth>
                                        <TextField
                                            onKeyPress={handleKeyPress}
                                            onChange={handleChange}
                                            name="name"
                                            value={name}
                                            label="Name"
                                            variant="outlined"
                                            error={FormError.name}
                                            helperText={FormError.name}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item xs={4}>
                                    <FormControl fullWidth>
                                        <TextField
                                            onChange={handleChange}
                                            onBlur={validateEmail}
                                            type={'email'}
                                            name="email"
                                            value={email}
                                            label="Email"
                                            variant="outlined"
                                            error={FormError.email}
                                            helperText={FormError.email}
                                        />
                                    </FormControl>
                                    <span style={{ fontWeight: 'bold', color: 'red' }}>{emailError}</span>
                                </Grid>
                                <Grid item xs={4}></Grid>
                                <Grid item xs={4}>
                                    <FormControl fullWidth>
                                        <TextField
                                            onChange={handleChange}
                                            type={'password'}
                                            name="password"
                                            value={password}
                                            label="password"
                                            variant="outlined"
                                            error={FormError.password}
                                            helperText={FormError.password}
                                        />
                                    </FormControl>
                                </Grid>

                                <Grid item xs={4}>
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
                                            error={FormError.phone}
                                            helperText={FormError.phone}
                                        />
                                    </FormControl>
                                </Grid>

                                <Grid item xs={4}></Grid>

                                <Grid item xs={4}>
                                    <FormControl fullWidth>
                                        <TextField
                                            onChange={handleChange}
                                            type={'text'}
                                            name="address"
                                            value={address}
                                            label="Address"
                                            variant="outlined"
                                            error={FormError.address}
                                            helperText={FormError.address}
                                        />
                                    </FormControl>
                                </Grid>

                                <Grid item xs={4}>
                                    <Stack>
                                        <Autocomplete
                                            multiple
                                            id="tags-outlined"
                                            name="service"
                                            options={services ? services : []}
                                            getOptionLabel={(option) => option.name}
                                            filterSelectedOptions
                                            onChange={(e, service) => {
                                                selectedPartner(service);
                                            }}
                                            renderInput={(params) => (
                                                <TextField
                                                    {...params}
                                                    variant="outlined"
                                                    label="Select Services"
                                                    placeholder="Select Service"
                                                    error={FormError.service}
                                                    helperText={FormError.service}
                                                />
                                            )}
                                        />
                                    </Stack>
                                </Grid>

                                {/* <Grid item xs={4}>
                                <FormControl fullWidth>
                                    <TextField
                                        onChange={handleChange}
                                        onKeyDown={(e) =>
                                            (e.key == '.' || e.key == 'e' || e.key == '+' || e.key == 'E' || e.key == '-') &&
                                            e.preventDefault()
                                        }
                                        onKeyPress={(e) => {
                                            console.log(e.target.value.length > 1 ? e.preventDefault() : null);
                                        }}
                                        onWheel={(e) => e.target.blur()}
                                        type={'number'}
                                        name="commission"
                                        value={commission}
                                        label="Commission %"
                                        variant="outlined"
                                    />
                                </FormControl>
                            </Grid> */}

                                <Grid item xs={4}></Grid>

                                <Grid item xs={4}>
                                    <FormControl fullWidth>
                                        <TextField
                                            onChange={handleChange}
                                            onKeyDown={(e) =>
                                                (e.key == '.' || e.key == 'e' || e.key == '+' || e.key == 'E' || e.key == '-') &&
                                                e.preventDefault()
                                            }
                                            onKeyPress={(e) => {
                                                console.log(e.target.value.length > 2 ? e.preventDefault() : null);
                                            }}
                                            type={'number'}
                                            onWheel={(e) => e.target.blur()}
                                            name="charges"
                                            value={charges}
                                            label="Charges per hour in usd"
                                            variant="outlined"
                                            error={FormError.charges}
                                            helperText={FormError.charges}
                                        />
                                    </FormControl>
                                </Grid>
                                {/* <Grid item xs={4}></Grid> */}

                                {/* <Grid item xs={4}>
                                <FormControl variant="outlined" fullWidth>
                                    <InputLabel variant="outlined" htmlFor="uncontrolled-native"></InputLabel>
                                    <NativeSelect variant="outlined" name="service" value={service} onChange={handleChange}>
                                        <option selected>Select Service</option>
                                        {services &&
                                            services.map((res) => {
                                                return (
                                                    <option key={res._id} value={res._id}>
                                                        {res.name}
                                                    </option>
                                                );
                                            })}
                                    </NativeSelect>
                                </FormControl>
                            </Grid> */}
                                <Grid item xs={6.5}>
                                    <FormControl fullWidth width="60%">
                                        <FileInput accept="image" Values={image} name="image" changeHandler={handleChange} />
                                        {/* <TextField
                                        onChange={handleChange}
                                        InputProps={{
                                            disableUnderline: true,
                                        }}
                                        inputProps={{ accept: 'image/png, image/jpeg'}}
                                        type={'file'}
                                        label="Image"
                                        name="image"
                                        variant="standard"
                                        style={{ border: '0' }}
                                    /> */}
                                        <span style={{ fontWeight: 'bold', color: 'red' }}>{FormError.image}</span>
                                    </FormControl>
                                    {imageLoading ? (
                                        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                                            <CircularProgress />
                                        </Box>
                                    ) : null}
                                    {Values.image ? 'uploaded !' : null}
                                </Grid>

                                <Grid item xs={4}>
                                    <FormControl fullWidth>
                                        {/* <Typography component="legend">Company Number</Typography> */}
                                        <TextField
                                            onChange={handleChange}
                                            type={'number'}
                                            name="companyNumber"
                                            value={companyNumber}
                                            label="CompanyNumber"
                                            variant="outlined"
                                            onKeyDown={(e) =>
                                                (e.key == '.' || e.key == 'e' || e.key == '+' || e.key == 'E' || e.key == '-') &&
                                                e.preventDefault()
                                            }
                                            error={FormError.companyNumber}
                                            helperText={FormError.companyNumber}
                                        />
                                    </FormControl>
                                </Grid>
                                          
                             {/* <Grid item xs={6.5}>
                                    <FormControl fullWidth width="60%">
                                        <FileInput accept="banner" name="banner" changeHandler={handleChange} />
                                    </FormControl>
                                    </Grid> */}

                                <Grid item xs={6}>
                                    <Typography component="legend">Rating</Typography>
                                    <Rating
                                        name="rating"
                                        value={rating}
                                        onChange={(event, newValue) => {
                                            setValues({ ...Values, [event.target.name]: newValue });
                                        }}
                                    />
                                </Grid>

                                

                                <Grid item xs={12}>
                                    <h1>Documents</h1>
                                </Grid>

                                {/*------------------------ Passport */}

                                <Grid container xs={8} pl={5} spacing={4}>
                                    <Grid item xs={3}>
                                        <h3>Passport </h3>
                                    </Grid>

                                    <Grid item xs={7}>
                                        <FormControl fullWidth>
                                            {/* <InputLabel variant='outlined' htmlFor='document-type'>Passport</InputLabel> */}
                                            {/* <TextField
                                        disabled={imageLoading}
                                        onChange={handleChange}
                                        InputProps={{
                                            disableUnderline: true
                                        }}
                                        inputProps={{ accept: 'image/png, image/jpeg, application/pdf'}}
                                        type={'file'}
                                        // required
                                        // label="passport"
                                        name="passport"
                                    /> */}
                                            <FileInput Values={Values} name="passport" changeHandler={handleChange} />
                                        </FormControl>
                                        {Values.passport ? 'uploaded !' : null}
                                    </Grid>

                                    {/* -----------------------> License */}

                                    <Grid item xs={3}>
                                        <h3>Driving License </h3>
                                    </Grid>

                                    <Grid item xs={7}>
                                        <FormControl fullWidth>
                                            {/* <InputLabel variant='outlined' htmlFor='document-type'>Passport</InputLabel> */}
                                            {/* <TextField
                                        disabled={imageLoading}
                                        onChange={handleChange}
                                        InputProps={{
                                            disableUnderline: true
                                        }}
                                        inputProps={{ accept: 'image/png, image/jpeg, application/pdf'}}
                                        type={'file'}
                                        // required
                                        // label="drivingLicense"
                                        name="drivingLicense"
                                    /> */}
                                            <FileInput Values={Values} name="drivingLicense" changeHandler={handleChange} />
                                            {Values.drivingLicense ? 'uploaded !' : null}
                                        </FormControl>
                                    </Grid>

                                    {/* ------------------->3. Biometric Residence permit */}

                                    <Grid item xs={3}>
                                        <h3>Biometric Residence permit</h3>
                                    </Grid>

                                    <Grid item xs={7}>
                                        <FormControl fullWidth>
                                            {/* <InputLabel variant='outlined' htmlFor='document-type'>Passport</InputLabel> */}
                                            {/* <TextField
                                        disabled={imageLoading}
                                        onChange={handleChange}
                                        InputProps={{
                                            disableUnderline: true
                                        }}
                                        inputProps={{ accept: 'image/png, image/jpeg, application/pdf'}}
                                        type={'file'}
                                        // required
                                        // label="biometricResidencePermit"
                                        name="biometricResidencePermit"
                                    /> */}
                                            <FileInput Values={Values} name="biometricResidencePermit" changeHandler={handleChange} />
                                            {Values.biometricResidencePermit ? 'uploaded !' : null}
                                        </FormControl>
                                    </Grid>

                                    {/* ---------------------------> Citizen card */}

                                    <Grid item xs={3}>
                                        <h3>Citizen card file</h3>
                                    </Grid>

                                    <Grid item xs={7}>
                                        <FormControl fullWidth>
                                            {/* <InputLabel variant='outlined' htmlFor='document-type'>Passport</InputLabel> */}
                                            {/* <TextField
                                        disabled={imageLoading}
                                        onChange={handleChange}
                                        InputProps={{
                                            disableUnderline: true
                                        }}
                                        inputProps={{ accept: 'image/png, image/jpeg, application/pdf'}}
                                        type={'file'}
                                        // required
                                        // label="citizenCard"
                                        name="citizenCard"
                                    /> */}
                                            <FileInput Values={Values} name="citizenCard" changeHandler={handleChange} />
                                            {Values.citizenCard ? 'uploaded !' : null}
                                        </FormControl>
                                    </Grid>

                                    {/* ---------------------> EU national identity card */}

                                    <Grid item xs={3}>
                                        <h3>EU national identity card</h3>
                                    </Grid>

                                    <Grid item xs={7}>
                                        <FormControl fullWidth>
                                            <FileInput Values={Values} name="nationalIdentityCard" changeHandler={handleChange} />
                                            {Values.nationalIdentityCard ? 'uploaded !' : null}
                                        </FormControl>
                                    </Grid>
                                    {/* <Grid item xs={3}>
                                        <h3>Company Document </h3>
                                    </Grid> */}
                                    {/* <Grid item xs={7}>
                                        <FormControl fullWidth>
                                            <FileInput Values={Values} name="companyNumber" changeHandler={handleChange} />
                                            {Values.companyNumber ? 'uploaded !' : null}
                                            <span style={{ fontWeight: 'bold', color: 'red' }}>{FormError.companyNumber}</span>
                                        </FormControl>
                                    </Grid> */}
                                </Grid>

                                <Grid item xs={12}>
                                    <Box>
                                        <Button
                                            style={{ marginTop: '20px' }}
                                            disabled={!imageLoading ? false : true}
                                            type="submit"
                                            variant="contained"
                                        >
                                            Submit
                                        </Button>
                                    </Box>
                                </Grid>
                            </Grid>
                        </form>
                    </Box>
                </>
            )}

            {/* -----------------------------> Popup */}

            <ShowMessage message={message} open={openMessage} />
        </MainCard>
    );
};
