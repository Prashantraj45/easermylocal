import axios from "axios";


 const url = 'https://easer-dev-api.applore.in/'

// const url = 'http://localhost:8000/'

const instance = axios.create({
    baseURL:url,
    headers:{'X-Requested-With': 'XMLHttpRequest'}
})

export const checkToken = async () => {
    try{
        const token = localStorage.getItem("auth")
        if(token?.length > 30){
            instance.defaults.headers.common.Authorization=`Bearer ${token}`
        }
    }catch(err){
            console.log(err)
    }
}

checkToken()
export default instance;
