import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { callApi } from "../axios-services";
import { Snackbar } from "./Snackbar";

const Login = ({setToken, setLoggedIn, setMessage}) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const history = useHistory();

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const result = await callApi ({
        url: `/api/users/login`, 
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        data: {
            username,
            password
        }
      });
      
      setToken(result.data.token);
      console.log(result.data);
      if (result.data.token) {
        localStorage.setItem('token', JSON.stringify(result.data.token));
        localStorage.setItem('user', JSON.stringify(result.data.user));
        setLoggedIn(result.data.user);
        setMessage("Welcome Back, "+ result.data.user.firstName);
        Snackbar();
        history.push('/');
      } else {
        setMessage(result.data.message)
        Snackbar();
      }
      
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div id='container'>
      <div id='login'>
        <form onSubmit={handleSubmit}>
          <label htmlFor='username'>UserName: </label>
          <input type='text' id='username-input' name='username' placeholder='username' value={username} onChange={(event) => setUsername(event.target.value)}/>
          <label htmlFor='password'>Password: </label>
          <input type='password' id='password-input' name='password' placeholder='password' value={password} onChange={(event) => setPassword(event.target.value)}/>
          <button type='submit' className='button'>Login</button>
        </form>
      </div>
    </div>
  )
};

export default Login;
