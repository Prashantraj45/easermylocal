import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import MainCard from 'ui-component/cards/MainCard';
import Button from '@mui/material/Button';


//? material-ui
import { InputLabel, TextField, FormHelperText, MenuItem, Select, FormControl, FilledInput } from '@material-ui/core';
import { useState } from 'react';

export default () => {

    const [Values, setValues] = useState({
        name:'',
        active:''
    })
    
    const handleChange = (e) => {
        setValues({...Values, [e.target.name] : e.target.value})
        console.log(e.target,Values)
        console.log('calles');
    };

    const handleSubmit = (e) => {
        e.preventDefault()
        console.log('aaaaaaaaaaaaaaaaaaaaaa',Values)
    }

    const {name, active } = Values

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
                    
                    <Grid item xs={2}>
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
                    </Grid>
                </Grid>
                <Box >
                <Button style={{marginTop:'20px'}} disabled={name && active ? false : true} type='submit' variant="contained">Submit</Button>
                </Box>
                </form>
            </Box>
        </MainCard>
    );
};
