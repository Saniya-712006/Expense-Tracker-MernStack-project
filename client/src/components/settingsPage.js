import React,{useState,useEffect} from 'react';
import axios from 'axios';
import './settingstyle.css';


const SettingPage=()=>{
	  const [profileData, setProfileData] = useState({
	userName: '',
    email: '',
    currentPassword: '',
    newPassword: '',
    
  });
	
	 const [message, setMessage] = useState('');
	 const handleChange = (e) => {
    const { name, value } = e.target;
    setProfileData({ ...profileData, [name]: value });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/update-profile', profileData);
      if (response.data.success) {
        setMessage(response.data.message);
        alert(response.data.message);
        // Optionally refresh or redirect after successful update
      } else {
        alert(response.data.message || 'Error updating profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('An error occurred while updating the profile');
    }
  };
  
   useEffect(() => {
    const loadUserProfile = async () => {
      try {
        const response = await axios.get('/get-profile', {
          params: { email: profileData.email },
        });
        if (response.data) {
          setProfileData({
            email: response.data.email || '',
            currency: response.data.currency || 'USD',
            currentPassword: '',
            newPassword: '',
          });
        }
      }  catch (error) {
        console.error('Error loading profile:', error);
      }
    };

    loadUserProfile();
  }, []);
  
  
  
  
	return(
	<div>
  <h1>User Profile Management</h1>

  <form id="profile-form" onSubmit={handleSubmit}>
   
    <div className="section">
      <h2>Update Email</h2>
      <label htmlFor="email">Email Address:</label>
      <input type="email" id="email" name="email" placeholder="Enter your new email" value={profileData.email} onChange={handleChange}  required/>
    </div>

  
    <div className="section">
      <h2>Update Password</h2>
      <label htmlFor="current-password">Current Password:</label>
      <input 
	  type="password" 
	  id="current-password" 
	  name="current-password" 
	  value={profileData.currentPassword}
	  onChange={handleChange}
	  placeholder="Enter current password" 
	  required/>

      <label htmlFor="new-password">New Password:</label>
      <input type="password" 
	  id="new-password" 
	  name="new-password" 
	   value={profileData.newPassword}
	    onChange={handleChange}
	  placeholder="Enter new password" 
	  required minLength="8"/>
    </div>

   
    <div className="section">
      <h2>Currency Preferences</h2>
      <label htmlFor="currency">Preferred Currency:</label>
      <select id="currency" name="currency" value={profileData.currency} onChange={handleChange}>
        <option value="USD">USD - US Dollar</option>
        <option value="EUR">EUR - Euro</option>
        <option value="GBP">GBP - British Pound</option>
        <option value="INR">INR - Indian Rupee</option>
        <option value="AUD">AUD - Australian Dollar</option>
        <option value="CAD">CAD - Canadian Dollar</option>
      </select>
    </div>

    <div className="section">
      <button type="submit">Update Profile</button>
    </div>
  </form>
 {message && <p className="message">{message}</p>}

 

 
  </div>
);
}

export default SettingPage;