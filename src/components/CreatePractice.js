import React, { useEffect, useState } from 'react';
import { callApi } from "../axios-services";
import { Snackbar } from "./Snackbar";
import { useHistory } from 'react-router-dom';

const CreatePractice = ({ token, loggedIn, setMessage, setMyPracScores }) => {
  const [roundType, setRoundType] = useState('');
  const [pracScoreId, setPracScoreId] = useState('');
  const history  = useHistory();

  const handleSubmit = async (event, pracScoreId) => {
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

          const getData = async () => {
            const getPracScores = await callApi({
              url: `api/pracscores/user/${loggedIn.id}`,
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                },
              token
              });
              console.log("user", loggedIn)
            console.log(getPracScores);
            setMyPracScores(getPracScores.data.pracScores);

          };
          getData();
          setPracScoreId(newPractice.data.id)
          console.log("pracscoreid", pracScoreId)
          history.push(`/pracscores/${pracScoreId}`)

        } catch (error) {
          throw error
        }
      } else {
        setMessage("Please Select A Round Type");
        Snackbar();
    }


    
  };

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