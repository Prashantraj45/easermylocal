import { lazy, useEffect } from 'react';
import { useNavigate } from 'react-router';

// project imports
import MainLayout from 'layout/MainLayout';
import Loadable from 'ui-component/Loadable';
import Subscription from 'views/Subscription/Subscription';
import AddService from 'views/services/addService/AddService';
import AddServiceCategory from 'views/serviceCategory/addServiceCategory/AddServiceCategory';
import AddBusinessCategory from 'views/businessCategory/addBusinessCategory/AddBusinessCategory';
import AddSubscription from 'views/Subscription/addSubscription/AddSubscription';
import AddPartner from 'views/partner/addPartner/AddPartner';
import UpdateService from 'views/services/updateService/updateService';
import UpdateServiceCategory from 'views/serviceCategory/updateServiceCategory/updateServiceCategory';
import UpdatePartner from 'views/partner/UpdatePartner/updatePartner';
import UpdateSubscription from 'views/Subscription/updateSubscription/updateSubscription';
import SendMail from 'views/sendMail/sendMail';
import { element } from 'prop-types';
import PartnerRequestsTable from 'views/partner/PartnerRequest/partnerRequest';
import AddAdmin from 'views/Admin/addAdmin/AddAdmin';
import Admin from 'views/Admin/AdminTable/Admin';
import User from 'views/Users/Users'
import AddUser from 'views/Users/AddUser/AddUser';
import UpdateUser from 'views/Users/updateUser/UpdateUser';
import UserReferral from 'views/Users/userReferrals/userReferral';
import AddPost from 'views/Posts/addPost/AddPost';
import UpdatePost from 'views/Posts/updatePost/UpdatePost';
import SplashScreen from 'views/splashScreen/SplashScreen';
import AddScreen from 'views/splashScreen/AddScreen';
import UpdateScreen from 'views/splashScreen/UpdateScreen';

// dashboard routing
const DashboardDefault = Loadable(lazy(() => import('views/dashboard/Default')));

// utilities routing
const UtilsTypography = Loadable(lazy(() => import('views/utilities/Typography')));
const UtilsColor = Loadable(lazy(() => import('views/partner/Partner')));
const Posts = Loadable(lazy(() => import('views/Posts/Posts')));
const UtilsMaterialIcons = Loadable(lazy(() => import('views/serviceCategory/ServiceCategory')));
const UtilsTablerIcons = Loadable(lazy(() => import('views/services/Services')));
const Login = Loadable(lazy(() => import('views/pages/authentication/authentication3/Login3')));
const Users = Loadable(lazy(() => import ('views/Users/Users')))


// sample page routing
const SamplePage = Loadable(lazy(() => import('views/sample-page')));

// ==============================|| MAIN ROUTING ||============================== //

const MainRoutes = {


    
    path: '/',
    element: <MainLayout />,
    children: [
        {
            path: '/',
            element: <DashboardDefault />
        },
        {
            path: '/dashboard/default',
            element: <DashboardDefault />
        },
        {
            path: '/businessCategory',
            element: <UtilsTypography />
        },
        {
            path: '/partner',
            element: <UtilsColor />
        },
        {
            path:'/partnerRequests',
            element: <PartnerRequestsTable />
        },
        {
            path:'/addPartner',
            element: <AddPartner />
        },
        {
            path:'/partner/update/:id',
            element:<UpdatePartner />
        },
        {
            path: '/posts',
            element: <Posts />
        },
        {
            path: '/addpost',
            element: <AddPost />
        },
        {
            path:'posts/update/:id',
            element:<UpdatePost />
        },
        {
            path: '/services',
            element: <UtilsTablerIcons />
        },
        {
            path:'/services/update/:id',
            element:<UpdateService />
        },
        {
            path: '/serviceCategories',
            element: <UtilsMaterialIcons />
        },
        {
            path:'/serviceCategories/update/:id',
            element:<UpdateServiceCategory />
        },
        {
            path:"/users",
            element: <Users />
        },
        {
            path:"/subscription",
            element:<Subscription />
        },
        {
            path:'/addSubscription',
            element: <AddSubscription />
        },
        {
            path:'/subscription/update/:productId/:priceId',
            element: <UpdateSubscription />
        },
        {
            path: '/sample-page',
            element: <SamplePage />
        },
        {
            path:'/addService',
            element:<AddService/>
        },
        {
            path:'/addServiceCategory',
            element:<AddServiceCategory />
        },
        {
            path:'/addBusinessCategory',
            element:<AddBusinessCategory />
        },
        {
            path:'/sendMail',
            element:<SendMail />
        },
        {
            path:'/addadmin',
            element: <AddAdmin />
        },
        {
            path:'/admin',
            element: <Admin />
        },
        {
            path:'/user',
            element: <User />
        },
        {
            path:'/addUser',
            element:<AddUser />
        },
        {
            path:'/user/:id',
            element:<UpdateUser />
        },
        {
            path:'/user/referral',
            element:<UserReferral />
        },{
            path:'/splashscreen',
            element:<SplashScreen />
        },
        {
            path:'/addscreen',
            element:<AddScreen />
        },
        {
            path:'/splash/:id',
            element:<UpdateScreen />
        }
    ]
};

export default MainRoutes;
