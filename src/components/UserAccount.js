import React, { useState, useEffect } from "react";
import { useHistory } from 'react-router-dom';
import { callApi } from "../axios-services";
// import "../style/User.css";

const UserAccount = ({ token, loggedIn, myTourScores, setMyTourScores }) => {

  const history = useHistory();
  const [user, setUser] = useState({});


  useEffect(() => {
    const getData = async () => {
      const apiResponse = await callApi({
        url: `/api/users/me`,
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        token 
       });
       setUser(apiResponse.data);
       console.log('api response, user:', apiResponse);

      const getTourScores = await callApi({
        url: `api/users/${loggedIn.id}/scores`,
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          },
        token
        });
      console.log(getTourScores.data);
      setMyTourScores(getTourScores.data.tournaments);

    };
    getData();

  }, [token, loggedIn]);

  const handleEdit = async (event, userId) => {
    event.preventDefault();
    history.push(`/edit/users/${userId}`)
  }


  return (
    <div id='single-user'>
      {loggedIn ? (
        <>
          <div id='user-info'>
            <h2><u>Account Information</u></h2>
            <p><b>First Name:</b> {loggedIn.firstName}</p>
            <p><b>Last Name:</b> {loggedIn.lastName}</p>
            <p><b>Email Address:</b> {loggedIn.email}</p>
            <p><b>Username:</b> {loggedIn.username}</p>

            <button type="submit" className="button"
            onClick={e => handleEdit(e, user.id)}>Edit Account</button>
          </div>

          <div id='tour-scores'>
            {myTourScores && myTourScores.map((tourScore) => {
              return (
                <div key={tourScore.id} id='score-card'>
                  <div id='score-info'>
                    <h3>{tourScore.name}</h3>
                    <h3>{tourScore.date}</h3>
                    <h3>Level: {tourScore.level}</h3>
                    <h3>Round One Score: {tourScore.round1Score}</h3>
                    <h3>Round Two Score: {tourScore.round2Score}</h3>
                    <h3>Total Score: {tourScore.totalScore}</h3>
                  </div>
                  
                  {/* <div id='products'>
                    {order.products.map((product) => {
                      const lineTotal = product.price * product.quantity;
                      return (
                        <div id='order-product' key={product.id}>
                          <p>{product.quantity}x {product.name} | ${product.price}ea | Product Total: ${lineTotal}</p>
                        </div>
                      );
                    })}
                  </div> */}
                </div>
              );
            })}
          </div>
          

        </>
      ) : null}
    </div>
  );
};

export default UserAccount;
