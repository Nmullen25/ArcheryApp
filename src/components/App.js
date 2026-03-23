import React, { useState, useEffect } from "react";
import { Route } from "react-router-dom";
import { callApi } from "../axios-services";
import {
  Home,
  Title,
  Login,
  Register,
  UserAccount,
  PracScores,
  CreatePractice,
  ViewPractice,
  ViewScore
} from "./";

const App = () => {
  // const [APIHealth, setAPIHealth] = useState("");
  const userAuth = JSON.parse(localStorage.getItem("user"));
  const userToken = JSON.parse(localStorage.getItem("token"));
  const [token, setToken] = useState(userToken);
  const [loggedIn, setLoggedIn] = useState(userAuth);
  const [message, setMessage] = useState(null);
  const [myTourScores, setMyTourScores] = useState([]);
  const [myPracScores, setMyPracScores] = useState([]);
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
        <Title
          loggedIn={loggedIn}
          setLoggedIn={setLoggedIn}
          message={message}
          setMessage={setMessage}
          setToken={setToken}
        />
        <Route exact path="/">
          <Home 
            
          />
        </Route>

        <Route exact path="/login">
          <Login
            setLoggedIn={setLoggedIn}
            setToken={setToken}
            setMessage={setMessage}
          />
        </Route>

        <Route exact path="/register">
          <Register 
            setToken={setToken} 
            setMessage={setMessage}  
          />
        </Route>

        <Route exact path="/account">
          <UserAccount 
            token={token} 
            loggedIn={loggedIn}
            myTourScores={myTourScores}
            setMyTourScores={setMyTourScores}
          />
        </Route>

        <Route exact path="/pracscores">
          <PracScores
            CreatePractice={<CreatePractice />}
            token={token} 
            loggedIn={loggedIn}
            myPracScores={myPracScores}
            setMyPracScores={setMyPracScores}
            setMessage={setMessage}
          />
        </Route>

        <Route exact path="/pracscores/:pracScoreId">
          <ViewPractice 
            loggedIn={loggedIn}
            myPracScores={myPracScores}
          />
        </Route>

        <Route exact path="/tourscores/:tourScoreId">
          <ViewScore 
            loggedIn={loggedIn}
            myTourScores={myTourScores}
          />
        </Route>
      </div>
    </>
  );
};

export default App;