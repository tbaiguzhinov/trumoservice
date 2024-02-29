import {useEffect, useState} from "react";
import axios from "axios";

export const Home = () => {
     const [message, setMessage] = useState('');
     useEffect(() => {
        if(localStorage.getItem('access_token') === null){                   
            window.location.href = '/login'
        }
        else{
          console.log('local storage', localStorage.getItem('access_token'));
         (async () => {
           try {
             const {data} = await axios.get(   
                            'http://localhost:8000/', {
                             headers: {
                                'Authorization': `Bearer ${localStorage.getItem('access_token')}`
                             }}
                           );
             setMessage(data.message);
          } catch (e) {
            console.log('not auth')
          }
         })()};
     }, []);
     return (
        <div className="form-signin mt-5 text-center">
          <h3>Hello {message}!</h3>
          <br></br>
          <h4>My KYC data</h4>
          <div>
            <p>My data is here</p>
          </div>
          <h4>Login information</h4>
          <div>
            <p>My login information is here</p>
          </div>
        </div>
     )
}