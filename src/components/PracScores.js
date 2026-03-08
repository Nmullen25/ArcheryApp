import React, { useState, useEffect } from "react";
import { useHistory } from 'react-router-dom';
import { callApi } from "../axios-services";
// import "../style/User.css";
import CreatePractice from "./CreatePractice";

const PracScores = ({ token, loggedIn, myPracScores, setMyPracScores, setMessage }) => {

  const history = useHistory();

  useEffect(() => {
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

  }, [token, loggedIn.id]);

  return (
    <div id='user-prac-scores'>
      {loggedIn ? (
        <>
          <CreatePractice token={token} loggedIn={loggedIn} setMessage={setMessage}/>
          <div id='prac-scores'>
            {myPracScores.length? myPracScores && myPracScores.map((pracScore) => {
              return (
                <div key={pracScore.id} id='score-card'>
                  <div id='score-info'>
                    <h3>{pracScore.roundType}</h3>
                    <h3>{pracScore.date}</h3>
                    <h3>Round Score: {pracScore.roundScore}</h3>
                  </div>
                </div>
              );
            }) : null }
          </div>
        </>
      ) : null}
    </div>
  );
};

export default PracScores;
