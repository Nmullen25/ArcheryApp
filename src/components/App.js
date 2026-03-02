import React, { useState, useEffect } from "react";
import { Route } from "react-router-dom";
import { callApi } from "../axios-services";
import {
  Home
} from "./";

const App = () => {
  // const [APIHealth, setAPIHealth] = useState("");
  // const userAuth = JSON.parse(localStorage.getItem("user"));
  // const userToken = JSON.parse(localStorage.getItem("token"));
  // const [token, setToken] = useState(userToken);
  // const [loggedIn, setLoggedIn] = useState(userAuth);
  // const [message, setMessage] = useState(null);
  // const [products, setProducts] = useState([]);
  // const [orders, setOrders] = useState();
  // const [myCart, setMyCart] = useState();
  // const [users, setUsers] = useState();

  // const getAPIStatus = async () => {
  //   const healthy = await callApi({ url: "/api/health", method: "GET" });
  //   setAPIHealth(healthy ? "api is up! OK" : "api is down :/");
  // };


  // useEffect(() => {
  //   getAPIStatus();
  //   getCart();

  // }, [loggedIn, myCart, guestCart]); 
  
  return (
    <>
      <div className="app-container">
        {/* <Title
          // loggedIn={loggedIn}
          // setLoggedIn={setLoggedIn}
          // message={message}
          // setMessage={setMessage}
          // setMyCart={setMyCart}
          // setToken={setToken}
          // setGuestCart={setGuestCart}
        /> */}
        <Route exact path="/">
          <Home />
        </Route>
      </div>
    </>
  );
};

export default App;