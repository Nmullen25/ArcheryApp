import React, { useState, useEffect } from 'react'
import { useHistory } from 'react-router';
import { callApi } from '../axios-services'
// import "../style/Products.css";
// import "../style/Home.css";

const Home = () => {
  // const history = useHistory();
  
  
  // const goToProduct = (event, productId) => {
  //   event.preventDefault();
  //   history.push(`/products/${productId}`)
  // }

  return <div >
    <h1><u>Home</u></h1>
    <div id='home-buttons'>
      <button className='score-button' id='score-button'>Scores</button>
      <button className='tour-button' id='tour-button'>Tournaments</button>
      <button className='calendar-button' id='calendar-button'>Calendar</button>
    </div>
  </div>

};

export default Home;