// assets
import { Category, Dashboard } from '@mui/icons-material';



// ==============================|| UTILITIES MENU ITEMS ||============================== //

const utilities = {
    id: 'Services',
    title: 'Services',
    type: 'group',
    children: [
        {
            id:'Posts',
            title:'Posts',
            type:'item',
            url:'/posts'
        },
        {
            id:'admin',
            title:'Admin',
            type:'item',
            url:'/admin'
        },
        {
            id:"partnerRequests",
            title:"Partner Requests",
            type:'item',
            url:'/partnerrequests'
        },
        {
            id: 'Partner',
            title: 'Partner',
            type: 'item',
            url: '/partner',
            breadcrumbs: false
        },
        {
            id: 'User',
            title: 'User',
            type: 'item',
            url: '/user',
            breadcrumbs: false
        },
        {
            it:'userReferral',
            title:'User Referrals',
            type:'item',
            url:'/user/referral'
        },
        // {
        //     id:'service',
        //     title:'Services',
        //     type:'item',
        //     url:"/services"
        // },
        {
            id:'service-category',
            title:"Service Category",
            type:'item',
            url:'/serviceCategories'
        },
        {
            id:'Splash-screen',
            title:'Splash Screen',
            type:'item',
            url:'/splashscreen'
        },
        // {
        //     id:"subscription",
        //     title:"Subscription",
        //     type:'item',
        //     url:'/subscription'
        // },
        {
            id:'sendMail',
            title:'Send mail',
            type:'item',
            url:'/sendMail'
        },
    ]
};

export const dashboard = {
    id:'dashboard',
    title:'Dashboard',
    type:'group',
    icon:<Dashboard />,
    children :[
        {
            id:'dashboard',
            title:'Dashboard',
            type:'item',
            url:'/',
        }
    ]    
}

export const logout = {
    id: 'logout',
    title: 'Log out',
    type: 'group',
}

export default utilities;
