import React, { useState } from 'react';
import { useParams, useHistory } from 'react-router';

const ViewPractice = ({myPracScores, loggedIn}) => {
  const { pracScoreId } = useParams();
  const history = useHistory();
  const [pracScore] = myPracScores.filter(pracScore => pracScore.id === Number(pracScoreId));
  console.log(pracScore)

  // const roundEnds = {
  //           end1: ["ix", 5, 4], end2: ["x", 9, "m"], end3: [0, 0, 0], end4: [0, 0, 0], end5: [0, 0, 0],
  //           end6: [], end7: [], end8: [], end9: [], end10: []
  // };

  const roundEnds = pracScore.roundEnds;

  const roundType = pracScore.roundType; //pracScore.roundType

  let runTotal = 0;

  const showEnds = (round, endNumber) => {

    const endTotals = (round, endNumber) => {
      // Check if property exists and is an array
      if (!round || !Array.isArray(round[endNumber])) {
        return 0; // Return 0 if the array is missing
      }
      
      let endTotal = 0
      for (let i = 0; i < 3; i++) {
        if (roundType === "Vegas 300") {
          if (round[endNumber][i] === "x") {
            endTotal += 10;
          } else if (round[endNumber][i] === "m") {
            endTotal += 0;
          } else if (round[endNumber][i] === undefined) {
            round[endNumber][i] = 0;
            endTotal += 0;
          } else {
            endTotal += round[endNumber][i];
          }
        }

        if (roundType === "Vegas 450") {
          if (round[endNumber][i] === "x") {
            endTotal += 10;
          } else if (round[endNumber][i] === "m") {
            endTotal += 0;
          } else if (round[endNumber][i] === undefined) {
            round[endNumber][i] = 0;
            endTotal += 0;
          } else {
            endTotal += round[endNumber][i];
          }
        }

        if (roundType === "NFAA 300") {
          if (round[endNumber][i] === "x") {
            endTotal += 5;
          } else if (round[endNumber][i] === "ix") {
            endTotal += 5;
          } else if (round[endNumber][i] === "m") {
            endTotal += 0;
          } else if (round[endNumber][i] === undefined) {
            round[endNumber][i] = 0;
            endTotal += 0;
          } else {
            endTotal += round[endNumber][i];
          }
        }

        if (roundType === "USA 300") {
          if (round[endNumber][i] === "m") {
            endTotal += 0;
          } else if (round[endNumber][i] === undefined) {
            round[endNumber][i] = 0;
            endTotal += 0;
          } else {
            endTotal += round[endNumber][i];
          }
        }
        
        
      }
      return endTotal;
    }
    const totaledEnds = {};

    for (let i = 0; i < endNumber; i++) {
      const key = "end" + (i+1);
      console.log("key", key)
    
      const total = endTotals(round, key);
      console.log(key, 'total', total);
      
      totaledEnds[('end'+ (i+1))] = round[key];
      totaledEnds[key][3] = total;
      runTotal += total;
      totaledEnds[key][4] = runTotal;
      
      console.log("ends", totaledEnds);
      
    }
  };

  const value = 10;
  showEnds(roundEnds, value);
  console.log("Running Total", runTotal)
  pracScore.roundScore = runTotal;

  const goToEditPracScore = (event, pracScoreId) => {
    event.preventDefault();
    history.push(`/pracscores/${pracScoreId}`)
  }

  return (
    <>
      {Object.keys(roundEnds).map((key, i) => {
        return (
          <div key={i} id='single-review'>
            <button className='product-button' type='submit' 
              onClick={(e) => goToEditPracScore(e, roundEnds.key)}>
                <h4>
                  {roundEnds[key][0]},{roundEnds[key][1]},{roundEnds[key][2]}
                </h4>
                <h4>
                  End Total:{roundEnds[key][3]}, Running Total:{roundEnds[key][4]}
                </h4>
              </button>
          </div>
        )
      })}
    </>
          
  )

};

export default ViewPractice;