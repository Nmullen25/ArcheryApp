import React from "react";
import { Link, useHistory } from "react-router-dom";
import { Snackbar } from "./Snackbar";

const Title = ({ loggedIn, setLoggedIn, message, setMessage, setToken }) => {
  
  const history = useHistory();

  const handleHamburger = () => {
    const navUL = document.getElementById('nav-ul');
    navUL.classList.toggle('show');
  }

  const Logout = () => {
    setLoggedIn(null);
    setToken(null);
    setMessage("You have successfully logged out");
    Snackbar();
    handleHamburger();
    
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    history.push('/');
  }

  return <div id='site-title'>
    <nav>
      {/* <div id='title'> */}
      <Link className='title-link' to="/"><h1><b>Scoring Supremacy</b></h1></Link>
        {/* <h1><b>Scoring Supremacy</b></h1> */}
      {/* </div> */}
      {/* <div id='navbar'> */}
      <button className="hamburger" id="hamburger" onClick={handleHamburger}>
      <i className="fa fa-bars"></i>
      </button>
      <ul className="nav-ul" id="nav-ul">
        <li><Link className='navlink' to="/" onClick={handleHamburger}>Home</Link></li>
        <li>{loggedIn? 
          <Link className='navlink' to="/account" onClick={handleHamburger}>My Account</Link> 
          : 
          <Link className='navlink' to="/login" onClick={handleHamburger}>Login</Link>}
        </li>
        <li>{loggedIn? 
          <Link className='navlink' to="/" onClick={Logout}>Logout</Link> 
          : 
          <Link className='navlink' to="/register" onClick={handleHamburger}>Register</Link>}
        </li>
        <li>{loggedIn && (loggedIn.isAdmin === true) ? <Link className='navlink' to='/admin' onClick={handleHamburger}>Admin</Link> : null}</li>
        <li>{loggedIn? 
          <Link className='navlink' to="/pracscores" onClick={handleHamburger}>Practice Scores</Link> 
          : null }
        </li>
      </ul>
      {/* </div> */}
      <div id='snackbar'>{message}</div>
    </nav>
  </div>
};

export default Title;


