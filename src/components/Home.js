import React, { useState, useEffect } from 'react'
import { useHistory } from 'react-router';
import { callApi } from '../axios-services'
// import "../style/Products.css";
// import "../style/Home.css";

const Home = ({ products, setProducts }) => {
  const history = useHistory();
  
  
  // const goToProduct = (event, productId) => {
  //   event.preventDefault();
  //   history.push(`/products/${productId}`)
  // }

  return <div >
    <h1><u>Home</u></h1>
  </div>

};

export default Home;