import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import MainCard from 'ui-component/cards/MainCard';
import Button from '@mui/material/Button';


//? material-ui
import { InputLabel, TextField, FormHelperText, MenuItem, Select, FormControl, FilledInput } from '@material-ui/core';
import { useEffect, useState } from 'react';
import axios from 'axios';
import {isAuthenticated} from '../../../helpers/Authentication'
import { useNavigate } from 'react-router';
import instance, { BaseUrl } from 'helpers/BaseUrl';

export default () => {

    const [Values, setValues] = useState({
        name:'',
        unit_amount:'',
        description:'',
        currency:''
    })

    
    const handleChange = (e) => {
        setValues({...Values, [e.target.name] : e.target.value})
        console.log(e.target,Values)
        console.log('calles');
    };

    //UseNavigate

    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault()
        console.log('aaaaaaaaaaaaaaaaaaaaaa',Values)
        await instance({
            method:"POST",
            url:"api/subscription"
        // })
        }).then(res => {
            if(res.status == 200){
                navigate(-1)
            }
            console.log(res)
        })
    }

    const {name, description, unit_amount, currency } = Values

    return (
        <MainCard>
            <Box>
                    <form onSubmit={handleSubmit}>
                <Grid container spacing={5}>
                    <Grid item xs={6}>
                        <FormControl width={'50%'}>
                            <TextField onChange={handleChange} id="standard-basic" name='name' value={name} label="Name" variant="standard" />
                        </FormControl>
                    </Grid>
                    <Grid item xs={6}>
                        <FormControl width={'50%'}>
                            <TextField onChange={handleChange} type='number' id="standard-basic" name='unit_amount' value={unit_amount} label="Amount" variant="standard" />
                        </FormControl>
                    </Grid>
                    <Grid item xs={6}>
                        <FormControl width={'50%'}>
                            <TextField onChange={handleChange} id="standard-basic" name='currency' value={currency} label="Currency Type" variant="standard" />
                        </FormControl>
                    </Grid>
                    <Grid item xs={6}>
                        <FormControl width={'50%'}>
                            <TextField multiline={true} minRows={5} onChange={handleChange} id="standard-basic" name='description' value={description} label="Description" variant="standard" />
                        </FormControl>
                    </Grid>
                    
                    {/* <Grid item xs={2}>
                        <FormControl fullWidth>
                            <InputLabel id="demo-simple-select-label">Active</InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={active}
                                label="Active"
                                name='active'
                                onChange={handleChange}
                            >
                                <MenuItem value={'true'}>True</MenuItem>
                                <MenuItem value={'false'}>False</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid> */}
                </Grid>
                <Box >
                <Button style={{marginTop:'20px'}} disabled={name && unit_amount && currency && description ? false : true} type='submit' variant="contained">Submit</Button>
                </Box>
                </form>
            </Box>
        </MainCard>
    );
};
