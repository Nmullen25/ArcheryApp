import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { callApi } from '../axios-services';
import { Snackbar } from './Snackbar';
import "../style/App.css";

const Register = ({setToken, setMessage}) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [division, setDivision] = useState('');
  const [ageClass, setAgeClass] = useState('');
  const [gender, setGender] = useState('');

  const history = useHistory();

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const result = await callApi ({
        url: `/api/users/register`, 
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        data: {
          username,
          password,
          email,
          firstName,
          lastName,
          division,
          ageClass,
          gender
        }
      });
      
      console.log('register result', result);
      setToken(result.data.token);
      if (result.data.token) {
        setMessage(result.data.message);
        Snackbar();
        history.push('/login');
      } else {
        setMessage(result.data.message)
        Snackbar();
      }
    } catch (error) {
      throw error;
    }
  }

  const handleBackToHome = (event) => {
    event.preventDefault();
    history.push('/');
  }

  return (
    <div id='container'>
      
      <div className='register-form' id='register'>
        <form onSubmit={handleSubmit}>
          <label htmlFor='firstname'>First Name: </label>
          <input type='text' id='firstname-input' name='firstName' value={firstName} onChange={(event) => setFirstName(event.target.value)}/>
          <br />
          <label htmlFor='lastname'>Last Name: </label>
          <input type='text' id='lastname-input' name='lastName' value={lastName} onChange={(event) => setLastName(event.target.value)}/>
          <br />
          <label htmlFor='email'>Email Address: </label>
          <input type='text' id='email-input' name='email' value={email} onChange={(event) => setEmail(event.target.value)}/>
          <br />
          <label htmlFor='division'>Division: </label>
          <input type='text' id='division-input' name='division' value={division} onChange={(event) => setDivision(event.target.value)}/>
          <br />
          <label htmlFor='age-class'>Age Class: </label>
          <input type='text' id='age=class-input' name='age' value={ageClass} onChange={(event) => setAgeClass(event.target.value)}/>
          <br />
          <label htmlFor='gender'>Gender: </label>
          <input type='text' id='gender-input' name='gender' value={gender} onChange={(event) => setGender(event.target.value)}/>
          <br />
          <label htmlFor='username'>Username: </label>
          <input type='text' id='username-input' name='username' placeholder='username' value={username} onChange={(event) => setUsername(event.target.value)}/>
          <label htmlFor='password'>Password: </label>
          <input type='password' id='password-input' min-length='8' name='password' placeholder='password' value={password} onChange={(event) => setPassword(event.target.value)}/>
          <button type='submit' className='button'>Register</button>

          <button type="submit" className="button"
          onClick={e => handleBackToHome(e)}>
          Back to Home</button>
        </form>
      </div>
    </div>
  )
}

export default Register;