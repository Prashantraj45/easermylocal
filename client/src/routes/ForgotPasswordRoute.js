import { lazy } from 'react';

// project imports
import PasswordReset from 'views/pages/authentication/auth-forms/ResetPassword';
// ==============================|| AUTHENTICATION ROUTING ||============================== //

const ForgotPasswordRoute = {
    path: '/forgotpassword/:id',
    element:<PasswordReset />
};

export default ForgotPasswordRoute;
