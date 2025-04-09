// client/src/components/HomePage.js
import React from 'react';
import { Link,useNavigate } from 'react-router-dom';
import './homepage_styles.css';

import homepagelogo from '../project_images/home page logo.png';
import expensetrackerlogo from '../project_images/icon expense tracker2.png';
import expensehistorylogo from '../project_images/expense history icon.png';
import loginlogo from '../project_images/icon for login.png';
import aboutuslogo from '../project_images/icon for about us.png';
import settingslogo from '../project_images/icon for settings page.png';
import rateuslogo from '../project_images/icon for rate us.png';


const HomePage = () =>{ 

const navigate = useNavigate();

  const handleLogout = () => {
    // Clear user session
    localStorage.removeItem('userName');
    alert('You have been logged out.');
    navigate('/'); // Redirect to login/signup page
  };






return (
  <div>

<header id="headers" >
<a href="#" class="tab_headers">
<img src={homepagelogo} alt="home page" ></img>
<p>Home</p>
</a>

<a href="/expense-chart" class="tab_headers">
<img src={expensetrackerlogo} alt="expense tracker" ></img>
<p>Expense Tracker</p>
</a>

<a href="/suggestion-page:userName" class="tab_headers">
<img src={expensehistorylogo} alt="expense history" ></img>
<p>Suggestions Page</p>
</a>

<a href="/auth-page" class="tab_headers">
<img src={loginlogo} alt="login icon" />
<p>Sign up!</p>
</a>

<a href="/contact-us-page" class="tab_headers">
<img src={aboutuslogo} alt="contact us"></img>
<p>Contact Us</p>
</a>

<a href="/settings-page" class="tab_headers">
<img src={settingslogo} alt="settings"></img>
<p>Settings</p>
</a>

<a href="/rate-us" class="tab_headers">
<img src={rateuslogo} alt="rate us"></img>
<p>Rate us</p>
</a>


</header>

<section>
<button
          onClick={handleLogout}
          style={{
            padding: '10px 20px',
            marginLeft: '20px',
            backgroundColor: 'yellow',
            color: 'black',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
          }}
        >
          Logout
        </button>
</section>
  </div>
);
}
export default HomePage;