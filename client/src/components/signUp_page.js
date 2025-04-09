import React,{useState} from 'react';
import axios from 'axios';
import './signup_styles.css';
const SignUpPage=()=>{
	
const [formData,setFormData]=useState({
	name:"",
	email:"",
	password:"",
	confirmPassword:"",
});
	
const handleFormSubmit=async(e)=>{
	e.preventDefault();
	if(formData.password!==formData.confirmPassword){
		alert("Passwords do not match");
		return;
	}
	//alert('Form Submitted successfully');
	const newUser={
		name:formData.name,
		email:formData.email,
		password:formData.password,
	};
	try{
		const response=await axios.post('http://localhost:5000/api/auth/signup', newUser,{
			headers:{
				'Content-Type':'application/json',
			},
		});
		
		if(response.data.success){
			alert('User Signed up successfully!');
			localStorage.setItem('userName', response.data.user.name); 
		}
		else{
			alert(response.data.message || 'Sign Up failed');
		}
	}
	catch(err){
		//alert('Error occured during sign up!');
		 if (err.response && err.response.status === 400 && err.response.data.message) {
      alert(err.response.data.message); // Show "User already exists!" or other specific errors
    } else {
      // For unexpected errors, use a generic message
      alert('An error occurred during sign up. Please try again.');
    }
		console.log('Error is:',err);
	}
};

return(
	<div >
    <div  className="mainContent">
        <h2 >Signup</h2>
        <form onSubmit={handleFormSubmit}>
            <label htmlFor="name">Full Name</label><br/>
            <input
            type="text"
            id="name"
            name="name"
            placeholder="Enter your full name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          /><br />
            
            <label htmlFor="email">Email</label><br/>
             <input
            type="email"
            id="email"
            name="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
          /><br />
            
            <label htmlFor="password">Password</label><br/>
            <input
            type="password"
            id="password"
            name="password"
            placeholder="Enter your password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            required
          /><br />
            
            <label htmlFor="confirmPassword">Confirm Password</label><br/>
            <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            placeholder="Confirm your password"
            value={formData.confirmPassword}
            onChange={(e) =>
              setFormData({ ...formData, confirmPassword: e.target.value })
            }
            required
          /><br />
            
            <button id="submitButton" type="submit"  >Sign Up</button>
        </form>
       
    </div>
	</div>
);
};

export default SignUpPage;
