import { Link } from 'react-router-dom';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Divider, Grid, Stack, Typography, useMediaQuery } from '@mui/material';

// project imports
import AuthWrapper1 from '../AuthWrapper1';
import AuthCardWrapper from '../AuthCardWrapper';
import AuthLogin from '../auth-forms/AuthLogin';
import Logo from 'ui-component/Logo';
import AuthFooter from 'ui-component/cards/AuthFooter';
import Icon from '../../../../assets/images/easerLogo.png';

// assets

// ================================|| AUTH3 - LOGIN ||================================ //

const Login = () => {
    const theme = useTheme();
    const matchDownSM = useMediaQuery(theme.breakpoints.down('md'));

    return (
        <Grid
            container
            spacing={2}
            py={8}
            alignItems="center"
            justifyContent={'center'}
            style={{
                background: 'rgb(2,0,36)',
                background: 'linear-gradient(90deg, rgba(2,0,36,1) 0%, rgba(58,70,162,1) 1%, rgba(193,220,236,1) 96%)'
            }}
        >
            <Grid item xs={12}></Grid>
            <Grid container justifyContent="center" spacing={1} xs={4} style={{ backgroundColor: '#92a8d1', height: '85vh' }}>
                <Grid item xs={6} style={{ paddingTop: '40%', paddingLeft:'0'}}>
                    <img src={'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTVNy-fl9wFDtPhYL3AonG_mlGhyL7LnEVm9A&usqp=CAU'} width='110%' height={'60%'}/>
                </Grid>
            </Grid>
-            <Grid
                container
                justifyContent="center"
                spacing={1}
                lg={4}
                sm={4}
                md={4}
                xs={8}
                style={{ backgroundColor: 'white', height: '85vh' }}
            >
                <Grid item xs={12} textAlign={'center'} style={{ paddingTop: '0%' }}>
                    {/* <img src={Icon} width="20%" /> */}
                </Grid>
                <Grid item xs={6}>
                    <Stack alignItems="center" mb={2}>
                        <Typography variant="caption" fontSize="16px" textAlign={matchDownSM ? 'center' : 'left'}>
                            <img src={Icon} width="25%" style={{ display: 'block', paddingBottom: '2%' }} />
                            Enter your credentials to continue
                        </Typography>
                    </Stack>
                    <AuthLogin />
                </Grid>
            </Grid>
        </Grid>
    );
};

export default Login;
