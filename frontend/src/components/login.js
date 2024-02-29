import axios from "axios";
import {useState} from "react";
import base64 from 'base-64';

export const Login = () => {
     const [username, setUsername] = useState('');
     const [password, setPassword] = useState('');

     const submit = async e => {
          e.preventDefault();
          const user = {
                username: username,
                password: password,
                grant_type: 'password'
               };
          const client_id = process.env.CLIENT_ID;
          const client_secret = process.env.CLIENT_SECRET;
          const client_info = 'Basic ' + base64.encode('' + client_id + ':' + client_secret + '');
          const {data} = await                                                                            
                         axios.post('http://localhost:8000/o/token/',
                         user ,{headers: 
                        {
                          'Content-Type': 'multipart/form-data;',
                          'Authorization': client_info}},
                        {withCredentials: true});

         localStorage.clear();
         localStorage.setItem('access_token', data.access_token);
         localStorage.setItem('refresh_token', data.refresh_token);
         axios.defaults.headers.common['Authorization'] = 
                                         `Bearer ${data['access_token']}`;
         window.location.href = '/'
    }
    return(
      <div className="Auth-form-container">
        <form className="Auth-form" onSubmit={submit}>
          <div className="Auth-form-content">
            <h3 className="Auth-form-title">Sign In</h3>
            <div className="form-group mt-3">
              <label>Username</label>
              <input className="form-control mt-1" 
                placeholder="Enter Username" 
                name='username'  
                type='text' value={username}
                required 
                onChange={e => setUsername(e.target.value)}/>
            </div>
            <div className="form-group mt-3">
              <label>Password</label>
              <input name='password' 
                type="password"     
                className="form-control mt-1"
                placeholder="Enter password"
                value={password}
                required
                onChange={e => setPassword(e.target.value)}/>
            </div>
            <div className="d-grid gap-2 mt-3">
              <button type="submit" 
                 className="btn btn-primary">Submit</button>
            </div>
          </div>
       </form>
     </div>
     )
}