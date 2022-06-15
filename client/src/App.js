import { useSelector } from 'react-redux';

import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline, StyledEngineProvider } from '@mui/material';

// routing
import Routes from 'routes';

// defaultTheme
import themes from 'themes';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { SET_SEARCH } from 'store/actions';


// project imports

// ==============================|| APP ||============================== //

const App = () => {
    const customization = useSelector((state) => state.customization);

    const location = useLocation()
    const dispatch = useDispatch()


    useEffect(() => {
        console.log('Location changed');
        dispatch({ type: SET_SEARCH, data:'' })
        let search = document.getElementById('input-search-header')
        if(search){
            search.value = ''
        }
        
    },[location])

    return (
        <StyledEngineProvider injectFirst>
            <ThemeProvider theme={themes(customization)}>
                <CssBaseline />
                    <Routes />
            </ThemeProvider>
        </StyledEngineProvider>
    );
};

export default App;
