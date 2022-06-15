import axios from 'axios';
import instance, { BaseUrl } from 'helpers/BaseUrl';
import { useEffect, useState } from 'react';
import MainCard from 'ui-component/cards/MainCard';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import { InputLabel, TextField, FormHelperText, MenuItem, FormControl, FilledInput } from '@material-ui/core';
import Button from '@mui/material/Button';
import OutlinedInput from '@mui/material/OutlinedInput';
import { useTheme } from '@mui/material/styles';
import Stack from '@mui/material/Stack';
import Chip from '@mui/material/Chip';
import Autocomplete from '@mui/material/Autocomplete';
import Select from 'react-select';

export default () => {
    const [Values, setValues] = useState({
        mail: '',
        subject: '',
        message: '',
        userType: ''
    });

    const [partners, setpartners] = useState([]);

    useEffect(async () => {
        if (Values.userType == 'PARTNER') {
            await instance({
                method: 'GET',
                url: 'api/partner/'
            }).then((res) => {
                console.log(res);
                setpartners(res.data.partners);
            });
        } else if (Values.userType == 'USER') {
            try {
                await instance({
                    method: 'GET',
                    url: `api/user`
                }).then((res) => {
                    console.log(res.data.users);
                    if (res.status == 200) {
                        setpartners(res.data?.users);
                    }
                });
            } catch (err) {
                console.log(err);
            }
        }
    }, [Values.userType]);

    const handleChange = (e) => {
        console.log(e);
        console.log(e.target.name, e.target.value);
        setValues({ ...Values, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log(Values);
        await instance({
            method: 'POST',
            url: `api/admin/sendmail`,
            data: Values
        }).then((res) => {
            console.log(res);
        });
        e.preventDefault();
        console.log('HandleSubmit');
    };

    const selectedPartner = (users) => {
        let temp = [];
        users.map((x) => {
            temp.push(x.email);
        });
        setValues({ ...Values, mail: temp });
    };

    let { mail, subject, message } = Values;

    const options = [
        { value: 'USER', label: 'USER' },
        { value: 'PARTNER', label: 'PARTNER' }
    ];

    return (
        <MainCard title="Send Mail to User">
            <Box>
                <form onSubmit={handleSubmit}>
                    <Grid container spacing={5} p={2}>
                        <Grid item xs={5}>
                            <Select options={options} name="userType" onChange={(e) => setValues({ ...Values, userType: e.value })} />
                        </Grid>
                        <Grid item xs={5}>
                            <Stack>
                                {console.log(partners)}
                                <Autocomplete
                                    multiple
                                    id="tags-outlined"
                                    options={partners}
                                    getOptionLabel={(option) => option.email}
                                    filterSelectedOptions
                                    onChange={(e, mail) => {
                                        selectedPartner(mail);
                                    }}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            variant="outlined"
                                            label="Select Partner to send mail"
                                            placeholder="Select mail"
                                        />
                                    )}
                                />
                            </Stack>
                        </Grid>
                        {/* <Grid item xs={6} styles={{width:'73.5%'}}>
                        <Select options={options} />

                        </Grid>
                        <Grid item xs={6}>
                            <Stack spacing={3} >
                                <Autocomplete
                                    fullWidth
                                    multiple
                                    id="tags-outlined"
                                    options={partners}
                                    getOptionLabel={(option) => option.email}
                                    filterSelectedOptions
                                    onChange={(e, mail) => {
                                        selectedPartner(mail);
                                    }}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            variant="outlined"
                                            label="Select Partner to send mail"
                                            placeholder="Select mail"
                                        />
                                    )}
                                />
                            </Stack>
                        </Grid> */}
                        {/* <Grid item xs={6}>
                                <FormControl fullWidth >
                                    <TextField fullWidth type={'mail'} value={mail}  required onChange={handleChange} id="standard-basic" name='mail'  label="Enter Mail" variant="outlined" />
                                </FormControl>
                            </Grid> */}

                        <Grid item xs={5} mt={4}>
                            <FormControl fullWidth>
                                <TextField
                                    fullWidth
                                    required
                                    value={subject}
                                    onChange={handleChange}
                                    id="standard-basic"
                                    name="subject"
                                    label="Subject"
                                    variant="outlined"
                                />
                            </FormControl>
                        </Grid>

                        <Grid item xs={5} mt={4}>
                            <FormControl fullWidth width={'50%'}>
                                <TextField
                                    fullWidth
                                    required
                                    value={message}
                                    multiline={true}
                                    minRows={5}
                                    onChange={handleChange}
                                    id="standard-basic"
                                    name="message"
                                    label="Message"
                                    variant="outlined"
                                />
                            </FormControl>
                        </Grid>
                        <Grid item xs={8}>
                            <Button style={{ marginTop: '20px' }} type="submit" variant="contained">
                                Submit
                            </Button>
                        </Grid>
                    </Grid>
                </form>
            </Box>
        </MainCard>
    );
};
