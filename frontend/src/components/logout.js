import {useEffect, useState} from "react"
import axios from "axios";
export const Logout = () => {
    useEffect(() => {
       (async () => {
         try {
          console.log(process.env.CLIENT_ID, process.env.CLIENT_SECRET, localStorage.getItem('access_token'));
          const client_id = process.env.CLIENT_ID;
          const client_secret = process.env.CLIENT_SECRET;
          const token = 'token=' + localStorage.getItem('access_token') + '&client_id=' + client_id + '&client_secret=' + client_secret
           const {data} = await  
                 axios.post('http://localhost:8000/o/revoke_token/',
                 token,
                 {headers: {'Content-Type': 'application/x-www-form-urlencoded'}},  
                 {withCredentials: true});
           localStorage.clear();
           axios.defaults.headers.common['Authorization'] = null;
           window.location.href = '/login'
           } catch (e) {
             console.log('logout not working', e)
           }
         })();
    }, []);
    return (
       <div></div>
     )
}
