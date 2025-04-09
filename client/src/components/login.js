import React, { useState } from "react";
import './login_styles.css';
import axios from 'axios';

const Login = () => {
  const [isResetPassword, setIsResetPassword] = useState(false);
  const [loginForm, setLoginForm] = useState({ username: "",email:"", password: "" });
  const [resetForm, setResetForm] = useState({ email: "", newPassword: "" });
  const [errorMessage, setErrorMessage] = useState("");
  const [resetErrorMessage, setResetErrorMessage] = useState("");

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    const { email, password } = loginForm;

    if (!email || !password) {
      setErrorMessage("Please enter email and password.");
      return;
    }
	
	//const loginData={email,password};
	try{
		const response=await axios.post('http://localhost:5000/api/auth/login', loginForm,{
			headers:{
				'Content-Type':'application/json',
			},
		});
		if(response.data.success){
			alert('Login successful');
			localStorage.setItem('userName', response.data.user.name); 
			setErrorMessage("");
		}
		else{
			setErrorMessage('Invalid credentials');
		}
	}
  catch(err){
	  setErrorMessage(err.response?.data?.message || 'Error occured during login');
  };

    // Handle login (e.g., send data to the backend)
    
  };

  const handleResetSubmit = async (e) => {
    e.preventDefault();
    const { email, newPassword } = resetForm;

    const emailPattern = /^(?=.*[a-zA-Z])[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (!emailPattern.test(email)) {
      setResetErrorMessage("Please enter a valid email address.");
      return;
    }

    if (newPassword.length < 8) {
      setResetErrorMessage("Password must be at least 8 characters long.");
      return;
    }

	const resetData={email,password:newPassword};
	try{
		const response=await axios.post('http://localhost:5000/api/auth/reset-password', resetData,{
			headers:{
				'Content-Type':'application/json',
			},
		});
		if(response.data.success)
		{
			alert(`Password rest successful for : ${email}`);
			setResetForm(false);
			setResetErrorMessage("");
		}
		else
		{
			setResetErrorMessage("password reset failed. please try again");
		}
	}
	catch(err){
		setResetErrorMessage(err.response?.data?.message || "Error occurred during password reset.");
	}
   
  };

  const toggleResetPassword = () => {
    setIsResetPassword(!isResetPassword);
    setErrorMessage("");
    setResetErrorMessage("");
  };

  return (
    <div className="LoginMainContent" >
      <div className="InnerDiv" >
        {isResetPassword ? (
          <>
            <h1 >Reset Password</h1><br/>
            <form onSubmit={handleResetSubmit}>
              <label htmlFor="email">Email:</label><br/>
              <input
                type="email"
                id="email"
                value={resetForm.email}
                onChange={(e) => setResetForm({ ...resetForm, email: e.target.value })}
                required
                placeholder="Enter your email"
                
              /><br/>

              <label htmlFor="newPassword">New Password:</label><br/>
              <input
                type="password"
                id="newPassword"
                value={resetForm.newPassword}
                onChange={(e) => setResetForm({ ...resetForm, newPassword: e.target.value })}
                required
                placeholder="Enter a new password"
                minLength="8"
                
              /><br/>

              <button type="submit" >Reset Password</button><br/>

              {resetErrorMessage && <p className="errorMessage" >{resetErrorMessage}</p>}
            </form>
            <p><a href="#" onClick={toggleResetPassword}>Back to Login</a></p><br/>
          </>
        ) : (
          <>
            <h1 >Login</h1><br/>
            <form onSubmit={handleLoginSubmit}>
		
              <label htmlFor="email"> Email:</label><br/>
              <input
                type="email"
                id="email"
                value={loginForm.email}
                onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                required
                placeholder="Enter your email"
                
              /><br/>

              <label htmlFor="password">Password:</label><br/>
              <input
                type="password"
                id="password"
                value={loginForm.password}
                onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                required
                placeholder="Enter your password"
                
              /><br/>

              <button type="submit" >Login</button><br/>

              {errorMessage && <p className="errorMessage" >{errorMessage}</p>}
            </form>
            <p><a href="#" onClick={toggleResetPassword}>Forgot Password?</a></p><br/>
          </>
        )}
      </div>
    </div>
  );
};

export default Login;
