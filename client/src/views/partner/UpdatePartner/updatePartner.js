import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import MainCard from 'ui-component/cards/MainCard';
import Button from '@mui/material/Button';

//? material-ui
import { InputLabel, TextField, FormControl } from '@material-ui/core';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import instance from 'helpers/BaseUrl';
import NativeSelect from '@mui/material/NativeSelect';
import Rating from '@mui/material/Rating';
import Typography from '@mui/material/Typography';
import { fileUpload } from 'helpers/Upload';
import CircularProgress from '@mui/material/CircularProgress';
import validator from 'validator';

export default () => {
    //----------------------------------------->Hooks

    const [Values, setValues] = useState({
        name: '',
        email: '',
        image: '',
        phone: '',
        address: '',
        commission: '',
        rating: '',
        charges: '',
        service: '',
        verified: '',
        companyNumber: ''
    });
    const [services, setservices] = useState([]);
    const [imageLoading, setimageLoading] = useState(false);
    const [emailError, setEmailError] = useState('');
    const [message, setmessage] = useState('');
    const [openMessage, setopenMessage] = useState(false);

    const { id } = useParams();

    const getServices = async () => {
        await instance({
            method: 'GET',
            url: `api/admin/service/category`
        }).then((res) => {
            setservices(res.data?.data);
        });
    };

    useEffect(async () => {
        getServices();

        if (id) {
            await instance({
                method: 'GET',
                url: `api/partner/${id}`
            }).then((res) => {
                let data = res.data.partner;
                setValues({
                    ...Values,
                    name: data?.name,
                    email: data?.email,
                    phone: data?.phone,
                    address: data?.address,
                    // commission: data?.commission,
                    rating: data?.rating,
                    charges: data?.charges,
                    service: data?.service,
                    image: data?.image,
                    verified: data?.verified,
                    passport: data?.documents?.passport,
                    drivingLicense: data?.documents?.drivingLicense,
                    citizenCard: data?.documents?.citizenCard,
                    biometricResidencePermit: data?.documents?.biometricResidencePermit,
                    nationalIdentityCard: data?.documents?.nationalIdentityCard,
                    companyNumber: data?.documents?.companyNumber
                });
            });
        }
    }, []);

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

    //useNavigate
    const navigate = useNavigate();

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

    const { name, email, image, companyNumber, phone, address, commission, rating, charges, service } = Values;

    //-------------------------> Validation function

    const [FormError, setFormError] = useState({
        name: false,
        email: false,
        image: false,
        phone: false,
        service: false,
        address: false,
        charges: false
        // companyNumber: false
    });

    //? Validate
    const Validate = () => {
        let value = true;

        let err = {
            name: false,
            email: false,
            image: false,
            phone: false,
            service: false,
            address: false,
            charges: false
            // companyNumber: false
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
            err.companyNumber = 'Company Number cannot be empty !';
            value = false;
        }

        setFormError({ ...err });
        return value;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (Validate()) {
            console.log(Values);
            await instance({
                method: 'PUT',
                url: `api/partner/update/${id}`,
                data: Values
            }).then((res) => {
                if (res.status == 200) {
                    navigate(-1);
                }
            });
        }
    };

    return (
        <MainCard title="Update Partner">
            <Box>
                <form onSubmit={handleSubmit}>
                    <Grid container spacing={5}>
                        <Grid item xs={4}>
                            <FormControl fullWidth>
                                <TextField
                                    onChange={handleChange}
                                    error={FormError.name}
                                    helperText={FormError.name}
                                    name="name"
                                    value={name}
                                    label="Name"
                                    variant="outlined"
                                />
                            </FormControl>
                        </Grid>
                        <Grid item xs={4}>
                            <FormControl fullWidth width={'50%'}>
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
                                <span style={{ fontWeight: 'bold', color: 'red' }}>{emailError}</span>
                            </FormControl>
                        </Grid>
                        <Grid item xs={4}></Grid>
                        {/* <Grid item xs={6}>
                            <FormControl width={'50%'}>
                                <TextField
                                    onChange={handleChange}
                                    type={'password'}
                                    name="password"
                                    value={password}
                                    label="password"
                                    variant="standard"
                                />
                            </FormControl>
                        </Grid> */}

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

                        <Grid item xs={4}></Grid>

                        {/* <Grid item xs={4}>
                            <FormControl fullWidth>
                                <TextField
                                    onChange={handleChange}
                                    onKeyPress={(e) => {
                                        console.log(e.target.value.length > 1 ? e.preventDefault() : null);
                                    }}
                                    onWheel={(e) => e.target.blur()}
                                    type={'number'}
                                    name="commission"
                                    value={commission}
                                    label="Commission %"
                                    variant="outlined"
                                    onKeyDown={e => (e.key == '.'||e.key == 'e' || e.key == '+' || e.key == 'E' || e.key == '-') && e.preventDefault()}
                                />
                            </FormControl>
                        </Grid> */}

                        <Grid item xs={4}>
                            <FormControl fullWidth>
                                <TextField
                                    onChange={handleChange}
                                    onKeyPress={(e) => {
                                        console.log(e.target.value.length > 2 ? e.preventDefault() : null);
                                    }}
                                    onWheel={(e) => e.target.blur()}
                                    type={'number'}
                                    name="charges"
                                    value={charges}
                                    label="Charges per hour in usd"
                                    variant="outlined"
                                    error={FormError.charges}
                                    helperText={FormError.charges}
                                    onKeyDown={(e) =>
                                        (e.key == '.' || e.key == 'e' || e.key == '+' || e.key == 'E' || e.key == '-') && e.preventDefault()
                                    }
                                />
                            </FormControl>
                        </Grid>

                        {/* <Grid item xs={4}></Grid> */}

                        <Grid item xs={6}>
                            <Grid item xs={7.7}>
                                <FormControl fullWidth>
                                    <InputLabel variant="standard" htmlFor="uncontrolled-native"></InputLabel>
                                    <NativeSelect name="service" value={service} onChange={handleChange}>
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
                            </Grid>
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
                                        (e.key == '.' || e.key == 'e' || e.key == '+' || e.key == 'E' || e.key == '-') && e.preventDefault()
                                    }
                                    onWheel={(e) => e.target.blur()}
                                    error={FormError.companyNumber}
                                    helperText={FormError.companyNumber}
                                />
                            </FormControl>
                        </Grid>

                        <Grid item xs={4}>
                            <FormControl fullWidth>
                                <TextField
                                    onChange={handleChange}
                                    InputProps={{
                                        disableUnderline: true
                                    }}
                                    type={'file'}
                                    label="Image"
                                    name="image"
                                    variant="standard"
                                    style={{ border: '0' }}
                                    error={FormError.image}
                                    helperText={FormError.image}
                                />
                            </FormControl>
                            {imageLoading ? (
                                <Box sx={{ display: 'flex' }}>
                                    <CircularProgress />
                                </Box>
                            ) : null}
                        </Grid>

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

                        <Grid item xs={2}>
                            <h3>Passport </h3>
                        </Grid>

                        <Grid item xs={10}>
                            <FormControl fullWidth>
                                {/* <InputLabel variant='outlined' htmlFor='document-type'>Passport</InputLabel> */}
                                <TextField
                                    disabled={imageLoading}
                                    onChange={handleChange}
                                    InputProps={{
                                        disableUnderline: true
                                    }}
                                    inputProps={{ accept: 'image/png, image/jpeg, application/pdf' }}
                                    type={'file'}
                                    // label="passport"
                                    name="passport"
                                />
                            </FormControl>
                        </Grid>

                        {/* -----------------------> License */}

                        <Grid item xs={2}>
                            <h3>Driving License </h3>
                        </Grid>

                        <Grid item xs={10}>
                            <FormControl fullWidth>
                                {/* <InputLabel variant='outlined' htmlFor='document-type'>Passport</InputLabel> */}
                                <TextField
                                    disabled={imageLoading}
                                    onChange={handleChange}
                                    InputProps={{
                                        disableUnderline: true
                                    }}
                                    inputProps={{ accept: 'image/png, image/jpeg, application/pdf' }}
                                    type={'file'}
                                    // label="drivingLicense"
                                    name="drivingLicense"
                                />
                            </FormControl>
                        </Grid>

                        {/* ------------------->3. Biometric Residence permit */}

                        <Grid item xs={2}>
                            <h3>Biometric Residence permit</h3>
                        </Grid>

                        <Grid item xs={10}>
                            <FormControl fullWidth>
                                {/* <InputLabel variant='outlined' htmlFor='document-type'>Passport</InputLabel> */}
                                <TextField
                                    disabled={imageLoading}
                                    onChange={handleChange}
                                    InputProps={{
                                        disableUnderline: true
                                    }}
                                    inputProps={{ accept: 'image/png, image/jpeg, application/pdf' }}
                                    type={'file'}
                                    // label="biometricResidencePermit"
                                    name="biometricResidencePermit"
                                />
                            </FormControl>
                        </Grid>

                        {/* ---------------------------> Citizen card */}

                        <Grid item xs={2}>
                            <h3>Citizen card file</h3>
                        </Grid>

                        <Grid item xs={10}>
                            <FormControl fullWidth>
                                {/* <InputLabel variant='outlined' htmlFor='document-type'>Passport</InputLabel> */}
                                <TextField
                                    disabled={imageLoading}
                                    onChange={handleChange}
                                    InputProps={{
                                        disableUnderline: true
                                    }}
                                    inputProps={{ accept: 'image/png, image/jpeg, application/pdf' }}
                                    type={'file'}
                                    // label="citizenCard"
                                    name="citizenCard"
                                />
                            </FormControl>
                        </Grid>

                        {/* ---------------------> EU national identity card */}

                        <Grid item xs={2}>
                            <h3>EU national identity card</h3>
                        </Grid>

                        <Grid item xs={10}>
                            <FormControl fullWidth>
                                {/* <InputLabel variant='outlined' htmlFor='document-type'>Passport</InputLabel> */}
                                <TextField
                                    onChange={handleChange}
                                    InputProps={{
                                        disableUnderline: true
                                    }}
                                    inputProps={{ accept: 'image/png, image/jpeg, application/pdf' }}
                                    disabled={imageLoading}
                                    type={'file'}
                                    // label="nationalIdentityCard"
                                    name="nationalIdentityCard"
                                />
                            </FormControl>
                        </Grid>

                        {/* <Grid item xs={3}>
                            <h3>Company Document </h3>
                        </Grid>
                        <Grid item xs={7}>
                            <FormControl fullWidth>
                                <TextField
                                    onChange={handleChange}
                                    InputProps={{
                                        disableUnderline: true
                                    }}
                                    inputProps={{ accept: 'image/png, image/jpeg, application/pdf' }}
                                    disabled={imageLoading}
                                    type={'file'}
                                    // label="nationalIdentityCard"
                                    name="companyNumber"
                                />
                                <FileInput Values={Values} name="companyNumber" changeHandler={handleChange} />
                                {Values.companyNumber ? 'uploaded !' : null}
                                <span style={{ fontWeight: 'bold', color: 'red' }}>{FormError.companyNumber}</span>
                            </FormControl>
                        </Grid> */}
                    </Grid>
                    <Box>
                        <Button style={{ marginTop: '20px' }} disabled={!imageLoading ? false : true} type="submit" variant="contained">
                            Submit
                        </Button>
                    </Box>
                </form>
            </Box>
        </MainCard>
    );
};
