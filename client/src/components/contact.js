import React, { useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './contact_styles.css';

const ContactPage = () => {
	
	
	
	
 const navigate = useNavigate();

  // Check if the user is logged in
  useEffect(() => {
    const userName = localStorage.getItem('userName'); // Replace 'authToken' with your token key
    if (!userName) {
      alert('You need to log in first!');
      navigate('/auth-page'); // Redirect to login page
    }
  }, [navigate]);	
	

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission
    // Handle form submission here
   // alert('Form submitted');
   
   const formData = {
      name: e.target.name.value,
      email: e.target.email.value,
      message: e.target.message.value,
    };

   
  
    try {
      // Make a POST request to the backend
      const response = await axios.post('http://localhost:5000/api/auth/submit-contact', formData);

      if (response.data.success) {
        alert(response.data.message);
        e.target.reset(); // Clear the form after successful submission
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      console.error('Error submitting the form:', error);
      alert('An error occurred while submitting the form. Please try again later.');
    }
  };
   
   
   const handleLogout = () => {
    localStorage.removeItem('userName'); // Clear userName from localStorage
    alert('You have been logged out.');
    navigate('/auth-page'); // Redirect to login page
  };

   
   
   
   
   
  

  return (
    <div>
      <section className="contact">
        <div className="content">
          <h2>Contact Us</h2>
          <p>Feel free to reach out to us for any queries or assistance!</p>
        </div>
        <div className="container">
          <div className="contactinfo">
            <div className="box">
              <div className="icon">
                <i className="fa fa-map-marker" aria-hidden="true"></i>
              </div>
              <div className="text">
                <h3>Address</h3>
                <p>PES University, RR Campus, Outer Ring</p>
              </div>
            </div>
            <div className="box">
              <div className="icon">
                <i className="fa fa-phone" aria-hidden="true"></i>
              </div>
              <div className="text">
                <h3>Phone Number</h3>
                <p>9999999888</p>
              </div>
            </div>
            <div className="box">
              <div className="icon">
                <i className="fa fa-envelope" aria-hidden="true"></i>
              </div>
              <div className="text">
                <h3>Email</h3>
                <p>abc@gmail.com</p>
              </div>
            </div>
          </div>
          <div className="contactform">
            <form onSubmit={handleSubmit}>
              <h2>Send Message</h2>
              <div className="inputBox">
                <input type="text" name="name" required />
                <span>Name</span>
              </div>
              <div className="inputBox">
                <input type="email" name="email" required />
                <span>Email</span>
              </div>
              <div className="inputBox">
                <textarea name="message" required></textarea>
                <span>Type your message</span>
              </div>
              <div className="inputBox">
                <input type="submit" value="Send" />
              </div>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;
