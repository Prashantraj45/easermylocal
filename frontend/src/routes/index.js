import { useRoutes, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

// routes
import MainRoutes from './MainRoutes';
import AuthenticationRoutes from './AuthenticationRoutes';
import config from 'config';
import { useLocation } from 'react-router';
import ForgotPasswordRoute from './ForgotPasswordRoute';

// ==============================|| ROUTING RENDER ||============================== //

export default function ThemeRoutes() {
    const navigate = useNavigate();
    const location = useLocation();

    const isAuthenticated = () => {
        if (typeof window == undefined) {
            return false;
        }
        if (localStorage.getItem('auth')) {
            return localStorage.getItem('auth');
        } else {
            return false;
        }
    };

    useEffect(() => {
        if (!(location.pathname.includes('/forgotpassword'))) {
            if (!isAuthenticated()) {
                navigate('/login');
            }
        }
    }, []);

    return useRoutes([MainRoutes, AuthenticationRoutes, ForgotPasswordRoute], config.basename);
}


// {
//   path:'/forgotPassword',
//   element:<PasswordReset />
// }