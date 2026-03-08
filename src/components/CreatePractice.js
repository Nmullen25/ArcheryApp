import React, { useState } from 'react';
import { callApi } from "../axios-services";

const CreatePractice = ({ token, loggedIn, setMessage }) => {
  const [roundType, setRoundType] = useState('');

  const handleSubmit = async (event) => {
      event.preventDefault();

      if (roundType !== '') {

        try {
          const newPractice = await callApi({ 
              url: '/api/pracscores',
              token,
              method:'POST',
              data: {
                  userId: loggedIn.id,
                  roundType
              }
          });
          console.log('newPractice, ', newPractice);
          return newPractice;

        } catch (error) {
          throw error
        }
      } else {
        setMessage("Please Select A Round Type")
    }
  }

  return (

      <form className='create-practice-form' id='single-product' onSubmit={handleSubmit}>
          <h3>Create new Practice Round</h3>
          
          <select id="select" onChange={(e) => {setRoundType(e.target.value)}}>
              <option>Select a Round Type</option>
              <option value='Vegas 300'>Vegas 300</option>
              <option value='Vegas 450'>Vegas 450</option>
              <option value='NFAA 300'>NFAA 300</option>
          </select>

          <button className='button' type='submit'>Create Practice Round</button>

      </form>
      )
} 

export default CreatePractice;